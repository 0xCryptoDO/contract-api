import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compilerVersion, zeroAddress } from 'src/constants';
import {
  DeployContractDto,
  DeployContractResponseDto,
} from 'src/contract/dto/deploy-contract.dto';
import { ICOContract, ICOContractDocument } from './schemas';
import fs from 'fs';
import path from 'path';
import { formatContractName } from 'src/utils';
import { BigNumber } from 'ethers';
import { IICOConstructorArgs } from './types';
import { VerifyContractDto } from 'src/contract/dto/verify-contract.dto';
import { getInitialICOConstructorTypes } from './ico.constants';
import Handlebars from 'handlebars';
import { DeploymentService } from 'src/contract/deployment.service';
import { VerificationService } from 'src/contract/verification.service';
export const ICOContractTemplate = Handlebars.compile<{
  contractName: string;
  receiverAddress: string;
  ownerAddress: string;
}>(fs.readFileSync(path.resolve('./src/ico/hbs/ico.sol.hbs'), 'utf-8'));
export const ICOAIContractTemplate = Handlebars.compile<{
  contractName: string;
  receiverAddress: string;
  ownerAddress: string;
}>(fs.readFileSync(path.resolve('./src/ico/hbs/icoAI.sol.hbs'), 'utf-8'));

@Injectable()
export class ICOService {
  constructor(
    @InjectModel(ICOContract.name)
    private ICOContractModel: Model<ICOContractDocument>,
    private deploymentService: DeploymentService,
    private verificationService: VerificationService,
  ) {}

  private constructRequiredArgsFromICOContract(
    contract: ICOContract,
  ): IICOConstructorArgs {
    const args = {
      token: contract.token,
      price: BigNumber.from(contract.price).toHexString(),
      lockup: contract.lockup,
      maxPerWallet: BigNumber.from(contract.maxPerWallet).toHexString(),
    };
    if (!args.token) {
      args.token = zeroAddress;
    }
    return args;
  }

  public async getDeployInfo(
    deployDto: DeployContractDto,
    userId: string,
  ): Promise<DeployContractResponseDto> {
    const contract: ICOContract = await this.ICOContractModel.findOne({
      _id: deployDto.contractId,
      userId,
    }).lean();

    await this.deploymentService.checkBeforeDeploy({ contract, deployDto });

    const contractName = formatContractName(contract.name);

    const sourceCode = ICOContractTemplate({
      contractName,
      ownerAddress: contract.owner,
      receiverAddress: contract.receiverAddress,
    });

    const aiEnabled = contract.options?.aiFunction !== undefined;

    const aiSourceCode = aiEnabled
      ? ICOAIContractTemplate({
          contractName,
          ownerAddress: contract.owner,
          receiverAddress: contract.receiverAddress,
        })
      : undefined;

    const constructorArgs: IICOConstructorArgs =
      this.constructRequiredArgsFromICOContract(contract);

    await this.deploymentService.updateDeployInfo<
      ICOContractDocument,
      ICOContract
    >({
      contract,
      deployDto,
      model: this.ICOContractModel,
      sourceCode,
    });
    return {
      sourceCode,
      constructorArgs,
      contractName,
      compilerVersion,
      options: contract.options,
      aiSourceCode,
    };
  }

  public async verify(verifyDto: VerifyContractDto, userId: string) {
    const ICOContract: ICOContract = await this.ICOContractModel.findOne({
      _id: verifyDto.contractId,
      userId,
    }).lean();

    const args: IICOConstructorArgs =
      this.constructRequiredArgsFromICOContract(ICOContract);

    const types = getInitialICOConstructorTypes();

    return this.verificationService.verify(
      this.ICOContractModel,
      verifyDto,
      userId,
      args,
      types,
    );
  }
}
