import {
  AirDropType,
  ContractStatus,
  IAirDropContract,
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

import { CreateAirDropContractDto } from './dto';
import { AirDropContract, AirDropContractDocument } from './schemas';

export const AirDropContractTemplate = {
  [AirDropType.bnbMutlisend]: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(
      path.resolve('./src/airDrop/hbs/bnbMultisender.sol.hbs'),
      'utf-8',
    ),
  ),
  [AirDropType.tokenMultisend]: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(
      path.resolve('./src/airDrop/hbs/tokenMultisender.sol.hbs'),
      'utf-8',
    ),
  ),
  bnbMutlisendAi: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(
      path.resolve('./src/airDrop/hbs/bnbMultisenderAI.sol.hbs'),
      'utf-8',
    ),
  ),
  tokenMultisendAi: Handlebars.compile<{ contractName: string }>(
    fs.readFileSync(
      path.resolve('./src/airDrop/hbs/tokenMultisenderAI.sol.hbs'),
      'utf-8',
    ),
  ),
};

@Injectable()
export class AirDropService {
  constructor(
    @InjectModel(AirDropContract.name)
    private airDropContractModel: Model<AirDropContractDocument>,
    private deploymentService: DeploymentService,
    private verificationSercive: VerificationService,
  ) {}

  public async getDeployInfo(
    deployDto: DeployContractDto,
    userId: string,
  ): Promise<DeployContractResponseDto> {
    const contract: IAirDropContract = await this.airDropContractModel
      .findOne({
        _id: deployDto.contractId,
        userId,
      })
      .lean();

    await this.deploymentService.checkBeforeDeploy({ contract, deployDto });

    const contractName = formatContractName(contract.name);

    const sourceCode = AirDropContractTemplate[contract.airDropType]({
      contractName,
    });

    const aiEnabled = contract.options?.aiFunction !== undefined;

    let aiSourceCode: string | undefined = undefined;

    if (aiEnabled) {
      if (contract.airDropType === AirDropType.bnbMutlisend) {
        aiSourceCode = AirDropContractTemplate.bnbMutlisendAi({ contractName });
      } else {
        aiSourceCode = AirDropContractTemplate.tokenMultisendAi({
          contractName,
        });
      }
    }

    await this.deploymentService.updateDeployInfo<
      AirDropContractDocument,
      AirDropContract
    >({
      contract,
      deployDto,
      model: this.airDropContractModel,
      sourceCode,
    });
    return {
      sourceCode,
      constructorArgs: {},
      contractName,
      compilerVersion,
      options: contract.options,
      aiSourceCode,
    };
  }

  public async verify(verifyDto: VerifyContractDto, userId: string) {
    return this.verificationSercive.verify(
      this.airDropContractModel,
      verifyDto,
      userId,
    );
  }

  public async createAirDropContract(
    userId: string,
    params: CreateAirDropContractDto,
  ): Promise<CreateContractResDto> {
    const record = await this.airDropContractModel.create({
      userId,
      status: ContractStatus.waitingForDeployment,
      ...params,
      createdAt: new Date(),
    });
    return { id: record._id };
  }

  public async getAirDropContractById(id: string) {
    const contract = await this.airDropContractModel.findById(id).lean();
    if (!contract) {
      throw new NotFoundException(null, `Contract ${id} does not exists`);
    }
    return contract;
  }
}
