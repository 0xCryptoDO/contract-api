import { ILotteryContract, Net, rpcUrls } from '@cryptodo/contracts';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DeployContractDto,
  DeployContractResponseDto,
} from 'src/contract/dto/deploy-contract.dto';
import { LotteryContract, LotteryContractDocument } from './schemas';
import fs from 'fs';
import path from 'path';
import { formatContractName } from 'src/utils';
import { ethers } from 'ethers';
import { ILotteryConstructorArgs } from './types';
import { VerifyContractDto } from 'src/contract/dto/verify-contract.dto';
import {
  devAddress,
  devFee,
  getInitialLotteryConstructorTypes,
  lotteryCompilerVersion,
  refFee,
} from './lottery.constants';
import Handlebars from 'handlebars';
import { parseEther } from 'ethers/lib/utils';
import { VerificationService } from 'src/contract/verification.service';
import { DeploymentService } from 'src/contract/deployment.service';

export const LotteryContractTemplate = Handlebars.compile<{
  contractName: string;
  devFee: number;
  devAddress: string;
  refFee: number;
}>(fs.readFileSync(path.resolve('./src/lottery/hbs/lottery.sol.hbs'), 'utf-8'));

export const LotteryAIContractTemplate = Handlebars.compile<{
  contractName: string;
  devFee: number;
  devAddress: string;
  refFee: number;
}>(
  fs.readFileSync(path.resolve('./src/lottery/hbs/lotteryAI.sol.hbs'), 'utf-8'),
);

@Injectable()
export class LotteryService {
  constructor(
    @InjectModel(LotteryContract.name)
    private lotteryContractModel: Model<LotteryContractDocument>,
    private verificationSercive: VerificationService,
    private deploymentService: DeploymentService,
  ) {}

  private constructRequiredArgsFromLotteryContract(
    contract: ILotteryContract,
  ): ILotteryConstructorArgs {
    return {
      ownerFee: contract.ownerFee,
      ticketsPrice: parseEther(contract.ticketsPrice.toString()),
      ticketsAmount: contract.ticketsAmount,
      startTime: contract.startTime,
      endTime: contract.endTime,
      winnersPercentage: contract.winnersPercentage,
      valuePercantage: contract.valuePercantage,
    };
  }

  public async getDeployInfo(
    deployDto: DeployContractDto,
    userId: string,
  ): Promise<DeployContractResponseDto> {
    const contract: ILotteryContract = await this.lotteryContractModel
      .findOne({
        _id: deployDto.contractId,
        userId,
      })
      .lean();
    await this.deploymentService.checkBeforeDeploy({ contract, deployDto });
    const contractName = formatContractName(contract.name);

    const sourceCode = LotteryContractTemplate({
      devAddress: devAddress,
      devFee: devFee,
      refFee: refFee,
      contractName,
    });
    const constructorArgs: ILotteryConstructorArgs =
      this.constructRequiredArgsFromLotteryContract(contract);

    const aiEnabled = contract.options?.aiFunction !== undefined;

    const aiSourceCode = aiEnabled
      ? LotteryAIContractTemplate({
          devAddress: devAddress,
          devFee: devFee,
          refFee: refFee,
          contractName,
        })
      : undefined;

    await this.deploymentService.updateDeployInfo<
      LotteryContractDocument,
      LotteryContract
    >({
      contract,
      deployDto,
      model: this.lotteryContractModel,
      sourceCode,
    });
    return {
      contractName,
      sourceCode,
      constructorArgs,
      compilerVersion: lotteryCompilerVersion,
      options: contract.options,
      aiSourceCode,
    };
  }

  public async verify(verifyDto: VerifyContractDto, userId: string) {
    const contract: ILotteryContract = await this.lotteryContractModel
      .findOne({
        _id: verifyDto.contractId,
        userId,
      })
      .lean();

    const args: ILotteryConstructorArgs =
      this.constructRequiredArgsFromLotteryContract(contract);

    const types = getInitialLotteryConstructorTypes();

    return this.verificationSercive.verify(
      this.lotteryContractModel,
      verifyDto,
      userId,
      args,
      types,
      lotteryCompilerVersion,
    );
  }

  public async getLotteryById(id: string) {
    const lottery = await this.lotteryContractModel.findById(id).lean();
    if (!lottery) {
      throw new NotFoundException(null, `Contract ${id} does not exists`);
    }
    const address = lottery.address || lottery.testnetAddress;
    const net: Net = lottery.testnet ? 'testnet' : 'mainnet';
    const customHttpProvider = new ethers.providers.JsonRpcProvider(
      rpcUrls[lottery.network][net],
    );
    const readContract = new ethers.Contract(
      address,
      lottery.abi,
      customHttpProvider,
    );
    let currentLotteryID = await readContract.ID();
    currentLotteryID = currentLotteryID - 1;
    const blockId = await readContract.BlockID(currentLotteryID);
    const balance = await customHttpProvider.getBalance(address);
    const response = {
      pool: ethers.utils.formatEther(balance),
      endTime: new Date(blockId.endTime.toNumber()),
      ticketsAmount: blockId.ticketsAmount,
      ticketsBought: blockId.ticketsBought,
      description: lottery.description,
    };
    return response;
  }
}
