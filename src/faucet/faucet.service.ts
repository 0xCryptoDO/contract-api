import { Wallet, providers } from 'ethers';
import {
  CheckFaucetAvailabilityDto,
  CheckFaucetAvailabilityResDto,
  RequestFundsDto,
  RequestFundsResDto,
} from './dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { composeTxLink, getRpcUrl } from 'src/utils';
import { Deferrable, parseEther } from 'ethers/lib/utils';
import { faucetAmountToSend, Network } from '@cryptodo/contracts';
import { InjectModel } from '@nestjs/mongoose';
import {
  WalletRequestedFunds,
  WalletRequestedFundsDocument,
} from './schema/wallet-requested-funds.schema';
import { Model } from 'mongoose';
import moment from 'moment';

@Injectable()
export class FaucetService {
  constructor(
    @InjectModel(WalletRequestedFunds.name)
    private walletRequestedFundsModel: Model<WalletRequestedFundsDocument>,
  ) {
    Object.values(Network)
      .map((network) => ({ [network]: false }))
      .forEach((el) =>
        this.availableFaucets
          ? (this.availableFaucets[Object.keys(el)[0]] = Object.values(el)[0])
          : (this.availableFaucets = {
              [Object.keys(el)[0]]: Object.values(el)[0],
            }),
      );
    this.checkAllFaucets();
  }

  private timeToCheckFaucetInMunutes = 5;
  private nextCheckDate = moment()
    .add(this.timeToCheckFaucetInMunutes, 'seconds')
    .toDate();

  private availableFaucets: Partial<Record<Network, boolean>>;

  private async checkAllFaucets() {
    if (moment(new Date()).isBefore(this.nextCheckDate)) {
      return;
    }
    this.nextCheckDate = moment()
      .add(this.timeToCheckFaucetInMunutes, 'minutes')
      .toDate();

    const networks = Object.values(Network);
    await Promise.all(
      networks.map(async (network) => {
        try {
          const valueToSend = parseEther(
            faucetAmountToSend[network].toString(),
          );
          const provider = new providers.JsonRpcProvider(
            getRpcUrl(network as Network, true),
          );
          const wallet = new Wallet(
            process.env.FAUCET_WALLET_PRIVATE_KEY,
            provider,
          );
          const balance = await wallet.getBalance();
          if (!balance.lt(valueToSend)) {
            this.availableFaucets[network] = true;
          } else {
            this.availableFaucets[network] = false;
          }
        } catch (err) {
          this.availableFaucets[network] = false;
        }
      }),
    );
  }

  public async requestFunds(
    requestFundsDto: RequestFundsDto,
  ): Promise<RequestFundsResDto> {
    const walletInfo = await this.walletRequestedFundsModel.findOne(
      requestFundsDto,
    );

    if (walletInfo) {
      const nextAvailableDate = moment(walletInfo.lastFundedDate)
        .add(24, 'hours')
        .toDate();
      if (moment(nextAvailableDate).isAfter(new Date())) {
        throw new BadRequestException(
          `Next available date ${nextAvailableDate}`,
        );
      }
    }

    const valueToSend = parseEther(
      faucetAmountToSend[requestFundsDto.network].toString(),
    );
    const provider = new providers.JsonRpcProvider(
      getRpcUrl(requestFundsDto.network, true),
    );
    const wallet = new Wallet(process.env.FAUCET_WALLET_PRIVATE_KEY, provider);
    const [balance, nonce, gasPrice] = await Promise.all([
      wallet.getBalance(),
      wallet.getTransactionCount('pending'),
      provider.getGasPrice(),
    ]);
    const txRequest: Deferrable<providers.TransactionRequest> = {
      nonce: nonce,
      to: requestFundsDto.address,
      from: wallet.address,
      value: valueToSend,
      gasPrice,
    };
    const response: RequestFundsResDto = { isFaucetAvailable: false };
    let txRes: providers.TransactionResponse;
    if (!balance.lt(valueToSend)) {
      txRes = await wallet.sendTransaction(txRequest);
      response.isFaucetAvailable = true;
      response.txHash = txRes.hash;
      response.txInExplorerUrl = composeTxLink(
        requestFundsDto.network,
        txRes.hash,
        true,
      );
      const nextAvailableDate = new Date();
      nextAvailableDate.setHours(nextAvailableDate.getHours() + 24);
      await this.walletRequestedFundsModel.updateOne(
        {
          address: requestFundsDto.address,
          network: requestFundsDto.network,
        },
        {
          lastFundedDate: new Date(),
        },
        { upsert: true },
      );
      this.availableFaucets[requestFundsDto.network] = true;
    } else {
      this.availableFaucets[requestFundsDto.network] = false;
    }
    return response;
  }

  public async checkFaucetAvailability(
    checkFaucetAvailabilityDto: CheckFaucetAvailabilityDto,
  ): Promise<CheckFaucetAvailabilityResDto> {
    await this.checkAllFaucets();
    const walletInfo = await this.walletRequestedFundsModel.findOne(
      checkFaucetAvailabilityDto,
    );
    let nextAvailableDate: Date;
    if (walletInfo?.lastFundedDate) {
      nextAvailableDate = moment(walletInfo.lastFundedDate)
        .add(24, 'hours')
        .toDate();
    } else {
      nextAvailableDate = new Date();
    }
    const isAvailable =
      this.availableFaucets[checkFaucetAvailabilityDto.network] === true;
    const response: CheckFaucetAvailabilityResDto = {
      isAvailable,
    };
    if (nextAvailableDate) {
      response.nextAvailableDate = nextAvailableDate;
    }
    return response;
  }
}
