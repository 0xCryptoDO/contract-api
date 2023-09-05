import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import fs from 'fs';
import Handlebars from 'handlebars';
import { Model } from 'mongoose';
import path from 'path';

import { compilerVersion } from 'src/constants';
import { DeploymentService } from 'src/contract/deployment.service';
import {
  DeployContractDto,
  DeployContractResponseDto,
} from 'src/contract/dto/deploy-contract.dto';
import { VerifyContractDto } from 'src/contract/dto/verify-contract.dto';
import { VerificationService } from 'src/contract/verification.service';
import { formatContractName } from 'src/utils';

import { StakingContract, StakingContractDocument } from './schemas';
import {
  getInitialStakingWithoutTariffsConstructorTypes,
  getInitialStakingWithTariffsConstructorTypes,
} from './staking.constants';
import {
  IStakingWithoutTariffsConstructorArgs,
  IStakingWithTariffsConstructorArgs,
} from './types/staking.types';

export const StakingContractTemplate = {
  withoutTariffs: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(
      path.resolve('./src/staking/hbs/stakingWithoutTariffs.sol.hbs'),
      'utf-8',
    ),
  ),
  withTariffs: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(
      path.resolve('./src/staking/hbs/stakingWithTariffs.sol.hbs'),
      'utf-8',
    ),
  ),
  withoutTariffsAi: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(
      path.resolve('./src/staking/hbs/stakingWithoutTariffsAI.sol.hbs'),
      'utf-8',
    ),
  ),
  withTariffsAi: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(
      path.resolve('./src/staking/hbs/stakingWithTariffsAI.sol.hbs'),
      'utf-8',
    ),
  ),
};

@Injectable()
export class StakingService {
  constructor(
    @InjectModel(StakingContract.name)
    private stakingContractModel: Model<StakingContractDocument>,
    private deploymentService: DeploymentService,
    private verificationService: VerificationService,
  ) {}

  public async getDeployInfo(
    deployDto: DeployContractDto,
    userId: string,
  ): Promise<DeployContractResponseDto> {
    const contract = await this.stakingContractModel
      .findOne({
        _id: deployDto.contractId,
        userId,
      })
      .lean();

    await this.deploymentService.checkBeforeDeploy({ contract, deployDto });

    const contractName = formatContractName(contract.name);
    const templateName =
      contract.rewardRates.length > 1 ? 'withTariffs' : 'withoutTariffs';

    const sourceCode = StakingContractTemplate[templateName]({
      contractName,
    });

    const aiEnabled = contract.options?.aiFunction !== undefined;

    let aiSourceCode: string | undefined = undefined;

    if (aiEnabled) {
      if (contract.rewardRates.length > 1) {
        aiSourceCode = StakingContractTemplate.withTariffsAi({ contractName });
      } else {
        aiSourceCode = StakingContractTemplate.withoutTariffsAi({
          contractName,
        });
      }
    }

    await this.deploymentService.updateDeployInfo<
      StakingContractDocument,
      StakingContract
    >({
      contract,
      deployDto,
      model: this.stakingContractModel,
      sourceCode,
    });
    const constructorArgs =
      this.constructRequiredArgsFromStakingContract(contract);
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
    const contract = await this.stakingContractModel
      .findOne({
        _id: verifyDto.contractId,
        userId,
      })
      .lean();

    const args = this.constructRequiredArgsFromStakingContract(contract);

    const types =
      contract.lockPeriods.length > 1
        ? getInitialStakingWithTariffsConstructorTypes()
        : getInitialStakingWithoutTariffsConstructorTypes();
    return this.verificationService.verify(
      this.stakingContractModel,
      verifyDto,
      userId,
      args,
      types,
    );
  }

  private constructRequiredArgsFromStakingContract(
    contract,
  ):
    | IStakingWithTariffsConstructorArgs
    | IStakingWithoutTariffsConstructorArgs {
    const params = {
      token: contract.token,
      minStake: +contract.minStake,
      maxStake: +contract.maxStake,
      isEarlyWithdrawal: contract.isEarlyWithdrawal,
      penalty: contract.options.penalty || 0,
    };
    if (contract.lockPeriods.length > 1) {
      (params as IStakingWithTariffsConstructorArgs).lockPeriods =
        contract.lockPeriods;
      (params as IStakingWithTariffsConstructorArgs).rewardRates =
        contract.rewardRates;
    } else {
      (params as IStakingWithoutTariffsConstructorArgs).lockPeriod =
        contract.lockPeriods[0];
      (params as IStakingWithoutTariffsConstructorArgs).rewardRate =
        contract.rewardRates[0];
    }
    return params as
      | IStakingWithTariffsConstructorArgs
      | IStakingWithoutTariffsConstructorArgs;
  }
}
