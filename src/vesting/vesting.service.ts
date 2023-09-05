import {
  ContractStatus,
  IVestingContract,
  VestingType,
} from '@cryptodo/contracts';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import fs from 'fs';
import Handlebars from 'handlebars';
import { Model } from 'mongoose';
import path from 'path';
import { compilerVersion } from 'src/constants';
import { DeploymentService } from 'src/contract/deployment.service';
import { CreateContractResDto } from 'src/contract/dto/create-contract-res.dto';
import {
  DeployContractDto,
  DeployContractResponseDto,
} from 'src/contract/dto/deploy-contract.dto';
import { VerifyContractDto } from 'src/contract/dto/verify-contract.dto';
import { VerificationService } from 'src/contract/verification.service';
import { formatContractName } from 'src/utils';

import { CreateVestingContractDto } from './dto';
import { VestingContract, VestingContractDocument } from './schemas';
import {
  IVestingConstructorArgs,
  IVestingLockerConstructorArgs,
} from './types/vesting.types';
import {
  getInitialVestingConstructorTypes,
  getInitialVestingLockerConstructorTypes,
} from './vesting.constants';

export const VestingContractTemplate = {
  [VestingType.locker]: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(path.resolve('./src/vesting/hbs/lock.sol.hbs'), 'utf-8'),
  ),
  [VestingType.vesting]: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(path.resolve('./src/vesting/hbs/vesting.sol.hbs'), 'utf-8'),
  ),
  lockAi: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(path.resolve('./src/vesting/hbs/lockAI.sol.hbs'), 'utf-8'),
  ),
  vestingAi: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(
      path.resolve('./src/vesting/hbs/vestingAI.sol.hbs'),
      'utf-8',
    ),
  ),
};

@Injectable()
export class VestingService {
  constructor(
    @InjectModel(VestingContract.name)
    private vestingContractModel: Model<VestingContractDocument>,
    private deploymentService: DeploymentService,
    private verificationService: VerificationService,
  ) {}

  public async getDeployInfo(
    deployDto: DeployContractDto,
    userId: string,
  ): Promise<DeployContractResponseDto> {
    const contract: IVestingContract = await this.vestingContractModel
      .findOne({
        _id: deployDto.contractId,
        userId,
      })
      .lean();

    await this.deploymentService.checkBeforeDeploy({ contract, deployDto });

    const contractName = formatContractName(contract.name);

    const sourceCode = VestingContractTemplate[contract.vestingType]({
      contractName,
    });

    const aiEnabled = contract.options?.aiFunction !== undefined;

    let aiSourceCode: string | undefined = undefined;

    if (aiEnabled) {
      if (contract.vestingType === VestingType.vesting) {
        aiSourceCode = VestingContractTemplate.vestingAi({ contractName });
      } else {
        aiSourceCode = VestingContractTemplate.lockAi({ contractName });
      }
    }

    await this.deploymentService.updateDeployInfo<
      VestingContractDocument,
      VestingContract
    >({
      contract,
      deployDto,
      model: this.vestingContractModel,
      sourceCode,
    });
    const constructorArgs =
      this.constructRequiredArgsFromVestingContract(contract);
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
    const contract: IVestingContract = await this.vestingContractModel
      .findOne({
        _id: verifyDto.contractId,
        userId,
      })
      .lean();

    const args = this.constructRequiredArgsFromVestingContract(contract);

    const types =
      contract.vestingType === VestingType.locker
        ? getInitialVestingLockerConstructorTypes()
        : getInitialVestingConstructorTypes();
    return this.verificationService.verify(
      this.vestingContractModel,
      verifyDto,
      userId,
      args,
      types,
    );
  }

  public async createVestingContract(
    userId: string,
    params: CreateVestingContractDto,
  ): Promise<CreateContractResDto> {
    const record = await this.vestingContractModel.create({
      userId,
      status: ContractStatus.waitingForDeployment,
      ...params,
      createdAt: new Date(),
    });
    return { id: record._id };
  }

  public async getVestingContractById(id: string) {
    const contract = await this.vestingContractModel.findById(id).lean();
    if (!contract) {
      throw new NotFoundException(null, `Contract ${id} does not exists`);
    }
    return contract;
  }

  private constructRequiredArgsFromVestingContract(
    contract: IVestingContract,
  ): IVestingConstructorArgs | IVestingLockerConstructorArgs {
    const params = {
      token: contract.token,
      addresses: contract.addresses,
      amounts: contract.amounts,
    };
    if (contract.vestingType === VestingType.locker) {
      (params as IVestingLockerConstructorArgs).lockDuration =
        contract.lockDuration;
    }
    if (contract.vestingType === VestingType.vesting) {
      (params as IVestingConstructorArgs).unlockDates = contract.unlockDates;
      (params as IVestingConstructorArgs).unlockPercents =
        contract.unlockPercents;
    }
    return params as IVestingConstructorArgs | IVestingLockerConstructorArgs;
  }
}
