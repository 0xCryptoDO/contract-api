import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DeployContractDto,
  DeployContractResponseDto,
} from 'src/contract/dto/deploy-contract.dto';
import { ERC721Contract, ERC721ContractDocument } from './schemas';
import fs from 'fs';
import path from 'path';
import { IHbsERC721Params } from './types';
import { formatContractName } from 'src/utils';
import { VerifyContractDto } from 'src/contract/dto/verify-contract.dto';
import Handlebars from 'handlebars';
import { DeploymentService } from 'src/contract/deployment.service';
import { VerificationService } from 'src/contract/verification.service';
import { compilerVersion } from 'src/constants';

const incrementTokenMaxAmountSourceCode = fs.readFileSync(
  path.resolve('./src/erc721/hbs/incrementTokenMaxAmount.sol.hbs'),
  'utf-8',
);

const ERC721ContractTemplates = {
  presale: Handlebars.compile<IHbsERC721Params>(
    fs.readFileSync(
      path.resolve('./src/erc721/hbs/NoPresale.sol.hbs'),
      'utf-8',
    ),
  ),
  noPresale: Handlebars.compile<IHbsERC721Params>(
    fs.readFileSync(path.resolve('./src/erc721/hbs/NoParams.sol.hbs'), 'utf-8'),
  ),
  presaleAi: Handlebars.compile<IHbsERC721Params>(
    fs.readFileSync(
      path.resolve('./src/erc721/hbs/NoPresaleAI.sol.hbs'),
      'utf-8',
    ),
  ),
  noPresaleAi: Handlebars.compile<IHbsERC721Params>(
    fs.readFileSync(
      path.resolve('./src/erc721/hbs/NoParamsAI.sol.hbs'),
      'utf-8',
    ),
  ),
};

@Injectable()
export class ERC721Service {
  constructor(
    @InjectModel(ERC721Contract.name)
    private ERC721ContractModel: Model<ERC721ContractDocument>,
    private deploymentService: DeploymentService,
    private verificationSercive: VerificationService,
  ) {}

  public async getDeployInfo(
    deployDto: DeployContractDto,
    userId: string,
  ): Promise<DeployContractResponseDto> {
    const contract: ERC721Contract = await this.ERC721ContractModel.findOne({
      _id: deployDto.contractId,
      userId,
    }).lean();
    await this.deploymentService.checkBeforeDeploy({ contract, deployDto });
    const contractName = formatContractName(contract.name);

    let incrementTokenMaxAmount = '';

    if (contract.options?.incrementTokenMaxAmount) {
      incrementTokenMaxAmount = incrementTokenMaxAmountSourceCode;
    }

    let sourceCode: string;

    const hbsOptions: IHbsERC721Params = {
      founder: contract.founder,
      incrementTokenMaxAmount,
      name: `"${contract.name}"`,
      owner: contract.owner,
      price: `${contract.price} ether`,
      symbol: `"${contract.symbol}"`,
      timeForReveal: contract.timeForReveal,
      contractName: contractName,
      tokenPerTx: contract.tokenPerTx,
      tokenPerWallet: contract.tokenPerWallet,
      totalSupply: contract.totalSupply,
      uri: `"${contract.uri}"`,
    };

    if (contract.options?.presale) {
      sourceCode = ERC721ContractTemplates.presale(hbsOptions);
    } else {
      sourceCode = ERC721ContractTemplates.noPresale(hbsOptions);
    }

    const aiEnabled = contract.options?.aiFunction !== undefined;

    let aiSourceCode: string | undefined = undefined;

    if (aiEnabled) {
      if (contract.options?.presale) {
        aiSourceCode = ERC721ContractTemplates.presaleAi(hbsOptions);
      } else {
        aiSourceCode = ERC721ContractTemplates.noPresaleAi(hbsOptions);
      }
    }

    await this.deploymentService.updateDeployInfo<
      ERC721ContractDocument,
      ERC721Contract
    >({
      contract,
      deployDto,
      model: this.ERC721ContractModel,
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
      this.ERC721ContractModel,
      verifyDto,
      userId,
    );
  }
}
