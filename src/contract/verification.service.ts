import { Model } from 'mongoose';
import { BaseContract } from './schemas/base-contract.schema';
import { VerifyContractDto } from './dto/verify-contract.dto';
import { SolidityType } from 'src/types';

import { ethers } from 'ethers';
import { getRpcUrl } from 'src/utils/getRpcUrl';
import { ContractStatus, Net, explorerUrls } from '@cryptodo/contracts';
import { isVerificationEnabled } from 'src/utils/isVerificationEnabled';
import { explorerApiUrls, Network } from '@cryptodo/contracts';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';

import FormData from 'form-data';
import { entries } from 'lodash';
import {
  compilerVersion as defaultCompilerVersion,
  explorerApiKeys,
} from 'src/constants';
import {
  IVerificationArgs,
  IVerifyResponseData,
  IVerificationParams,
  IMantleVerificationArgs,
} from 'src/contract/types/contract.types';
import { IVerifyParams } from 'src/types';
import { sleep } from 'src/utils/sleep';
import { formatContractName } from 'src/utils/format-contact-name';

@Injectable()
export class VerificationService {
  private async verifyContract<ConstructorArguments>({
    contractAddress,
    sourceCode,
    network,
    testnet,
    contractName,
    types,
    constructorArguements,
    compilerVersion,
  }: IVerificationParams<ConstructorArguments>) {
    if (network === Network.okc) {
      return this.verifyOkxContract({
        contractAddress,
        sourceCode,
        compilerVersion: compilerVersion || defaultCompilerVersion,
      });
    }

    if (network === Network.gate) {
      return this.verifyGateContract({
        contractAddress,
        sourceCode,
        testnet,
        compilerVersion: compilerVersion || defaultCompilerVersion,
      });
    }

    const explorerApiUrl = testnet
      ? explorerApiUrls[network].testnet
      : explorerApiUrls[network].mainnet;
    const data = new FormData();
    const verificationArgs = this.getVerificationArgs({
      sourceCode,
      contractAddress,
      compilerVersion,
      constructorArguements,
      contractName,
      types,
      network,
    });
    for (const [key, value] of entries(verificationArgs)) {
      if (key && value) {
        data.append(key, value);
      }
    }
    const res = await axios.post(explorerApiUrl, data, {
      headers: { 'User-Agent': 'Mozilla/5.0', ...data.getHeaders() },
    });
    let message =
      typeof res.data?.message === 'string'
        ? res.data?.message
        : typeof res.data?.result === 'string'
        ? res.data?.result
        : '';
    message = message.toLowerCase();
    if (
      !message.includes('notok') &&
      (message.includes('ok') || message.includes('already verified'))
    ) {
      return res.data as IVerifyResponseData;
    }
    if (
      typeof res.data?.result === 'string' &&
      res.data.result.toLowerCase().includes('daily limit')
    ) {
      return res.data as IVerifyResponseData;
    }
    if (!+res.data.status) {
      throw new HttpException(
        {
          message: res.data?.result || message || 'verification failed',
          statusCode: HttpStatus.FAILED_DEPENDENCY,
        },
        HttpStatus.FAILED_DEPENDENCY,
      );
    }

    let checkVerificationResponse;
    let isFirstVerificationCall = true;
    const params: IVerifyParams = {
      guid: res.data.result,
      module: 'contract',
      action: 'checkverifystatus',
    };
    if (explorerApiKeys[network]) {
      params.apikey = explorerApiKeys[network];
    }
    if (+res?.data?.status) {
      do {
        if (!isFirstVerificationCall) {
          await sleep(15);
        }
        checkVerificationResponse = await axios.get(explorerApiUrl, { params });
        isFirstVerificationCall = false;
      } while (checkVerificationResponse?.data?.result === 'Pending in queue');
    }

    if (
      checkVerificationResponse?.data?.result
        .toLowerCase()
        .includes('already verified')
    ) {
      return;
    }

    if (!+checkVerificationResponse?.data?.status) {
      throw new BadRequestException(
        null,
        checkVerificationResponse?.data?.result,
      );
    }
  }

  private getVerificationArgs({
    sourceCode,
    contractAddress,
    contractName,
    compilerVersion,
    constructorArguements,
    types,
    network,
  }) {
    if (
      [
        Network.mantle,
        Network.bitgert,
        Network.aurora,
        Network.lightlink,
        Network.cronos,
        Network.eosEvm,
      ].includes(network)
    ) {
      const mantleVerificationArgs: IMantleVerificationArgs = {
        module: 'contract',
        action: 'verify',
        contractSourceCode: sourceCode,
        addressHash: contractAddress,
        codeformat: 'solidity-single-file',
        name: contractName,
        compilerVersion: compilerVersion || defaultCompilerVersion,
        optimization: 'true',
        evmversion: 'london',
        licenseType: 3,
      };
      if (constructorArguements && types) {
        mantleVerificationArgs.constructorArguments =
          ethers.utils.defaultAbiCoder
            .encode(types, constructorArguements)
            .slice(2);
      }
      return mantleVerificationArgs;
    }
    const verificationArgs: IVerificationArgs = {
      apikey: explorerApiKeys[network],
      module: 'contract',
      action: 'verifysourcecode',
      sourceCode,
      contractaddress: contractAddress,
      codeformat: 'solidity-single-file',
      contractName: contractName,
      compilerversion: compilerVersion || defaultCompilerVersion,
      optimizationUsed: 1,
      evmversion: 'london',
      licenseType: 3,
    };
    if (constructorArguements && types) {
      verificationArgs.constructorArguements = ethers.utils.defaultAbiCoder
        .encode(types, constructorArguements)
        .slice(2);
    }
    return verificationArgs;
  }

  private async verifyOkxContract({
    contractAddress,
    sourceCode,
    compilerVersion,
  }) {
    const data = JSON.stringify({
      contractAddress: contractAddress,
      contractSource: sourceCode,
      compilerVersion: compilerVersion,
      compilerType: 'Solidity(SingleFile)',
      evmVersion: 'default',
      optimization: true,
      optimizationRuns: 200,
      licenseType: 'MIT License (MIT)',
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://www.oklink.com/api/explorer/v1/okexchain_test/contract/verify/async',
      headers: {
        'x-apikey': explorerApiKeys[Network.okc],
        'Content-Type': 'application/json',
        referer:
          `https://www.oklink.com/ru/okc-test/verify-contract-sourcecode-sol-single?` +
          `address=${contractAddress}&edition=${compilerVersion}`,
      },
      data,
    };

    let isFirstVerificationCall = true;
    let checkVerificationResponse;
    let tryCount = 0;
    do {
      if (!isFirstVerificationCall) {
        await sleep(5);
      }
      tryCount++;
      checkVerificationResponse = await axios(config);
      isFirstVerificationCall = false;
    } while (
      checkVerificationResponse?.data?.data?.statusCode === 202 &&
      tryCount < 6
    );

    if (+checkVerificationResponse?.data?.data?.statusCode !== 200) {
      throw new BadRequestException(null, checkVerificationResponse?.data?.msg);
    }
  }

  private async verifyGateContract({
    contractAddress,
    sourceCode,
    compilerVersion,
    testnet,
  }) {
    const data = {
      contractAddress: contractAddress,
      version: compilerVersion,
      evmVersion: 'default',
      license: 'MIT',
      optimize: 1,
      runs: 200,
      content: sourceCode,
    };
    const net: Net = testnet ? 'testnet' : 'mainnet';
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${explorerApiUrls.GATE[net]}/contract/verify`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    let isFirstVerificationCall = true;
    let checkVerificationResponse;
    let tryCount = 0;
    do {
      if (!isFirstVerificationCall) {
        await sleep(5);
      }
      tryCount++;
      checkVerificationResponse = await axios(config);
      isFirstVerificationCall = false;
    } while (checkVerificationResponse?.data?.status !== 1 && tryCount < 6);

    if (+checkVerificationResponse?.data?.status !== 1) {
      throw new BadRequestException(
        null,
        checkVerificationResponse?.data?.message,
      );
    }
  }

  //not working, code for possible future solutions
  private async verifyEvmOsContract({
    contractAddress,
    sourceCode,
    compilerVersion,
    testnet,
  }) {
    const data = {
      contractAddress: contractAddress,
      version: compilerVersion,
      compilerType: 1,
      openSourceLicenseType: 3,
      optimization: 'on',
      optimizers: 200,
      contractCode: sourceCode,
      evmVersionToTarget: 0,
    };
    const net: Net = testnet ? 'testnet' : 'mainnet';
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${explorerUrls.EVMOS[net]}/verifyContract-solc`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };
    await axios(config);

    let isFirstVerificationCall = true;
    let checkVerificationResponse;
    let tryCount = 0;
    do {
      if (!isFirstVerificationCall) {
        await sleep(5);
      }
      tryCount++;
      checkVerificationResponse = await axios({
        method: 'get',
        url: `${explorerUrls.EVMOS[net]}/verifyContract-result/${contractAddress}`,
      });
      isFirstVerificationCall = false;
    } while (checkVerificationResponse?.data?.status !== 1 && tryCount < 6);

    if (+checkVerificationResponse?.data?.status !== 1) {
      throw new BadRequestException(
        null,
        checkVerificationResponse?.data?.message,
      );
    }
  }

  public async verify<ContractModel extends BaseContract, Args>(
    model: Model<ContractModel>,
    verifyDto: VerifyContractDto,
    userId: string,
    args?: Args,
    types?: SolidityType[],
    compilerVersion?: string,
  ) {
    const contract = await model
      .findOne({
        _id: verifyDto.contractId,
        userId,
      })
      .lean();

    if (!contract) {
      throw new NotFoundException(
        null,
        `Contract ${verifyDto.contractId} not found`,
      );
    }
    const provider = new ethers.providers.JsonRpcProvider(
      getRpcUrl(contract.network, contract.testnet),
    );

    const transaction = await provider.getTransaction(verifyDto.hash);
    if (!transaction) {
      throw new BadRequestException(
        `Transaction not found for contract ${verifyDto.contractId} in ${contract.network} network`,
      );
    }
    const receipt = await transaction.wait();
    const contractAddress = receipt.contractAddress;

    const addressName = contract.testnet ? 'testnetAddress' : 'address';
    if (!contract.address || contract[addressName] !== contractAddress) {
      await model.updateOne(
        { _id: verifyDto.contractId },
        {
          [addressName]: contractAddress,
          status: ContractStatus.deployed,
          txHash: verifyDto.hash,
        },
      );
    }

    if (isVerificationEnabled(contract)) {
      const contractName = formatContractName(contract.name);
      await this.verifyContract<Args>({
        contractAddress: contractAddress,
        contractName,
        sourceCode: contract.sourceCode,
        constructorArguements: args ? Object.values(args) : null,
        network: contract.network,
        testnet: contract.testnet,
        compilerVersion,
        types,
      });
    }
  }
}
