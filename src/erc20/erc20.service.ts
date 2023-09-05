import { ContractType } from '@cryptodo/contracts';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
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
import { SolidityType } from 'src/types';
import { formatContractName } from 'src/utils/format-contact-name';
import { getInitialERC20ConstructorTypes } from './erc20.constants';
import { ERC20Contract, ERC20ContractDocument } from './schemas';
import { IERC20ConstructorArgs, IHbsERC20Params } from './types';

export const contractTemplates = {
  [ContractType.erc20Contract]: Handlebars.compile<IHbsERC20Params>(
    fs.readFileSync(path.resolve('./src/erc20/hbs/Token.sol.hbs'), 'utf-8'),
  ),
  aiTemplate: Handlebars.compile<IHbsERC20Params>(
    fs.readFileSync(path.resolve('./src/erc20/hbs/TokenAI.sol.hbs'), 'utf-8'),
  ),
};

@Injectable()
export class ERC20Service {
  constructor(
    @InjectModel(ERC20Contract.name)
    private ERC20ContractModel: Model<ERC20ContractDocument>,
    private verificationService: VerificationService,
    private deploymentService: DeploymentService,
  ) {}

  private constructRequiredArgsFromERC20Contract(
    contract: ERC20Contract,
    type: ContractType,
  ): IERC20ConstructorArgs {
    return {
      initialOwner: contract.initialOwner,
      name: contract.name,
      symbol: contract.symbol,
      decimals: contract.decimals,
      //TODO: fix
      totalSupply:
        type === ContractType.erc20Contract
          ? BigNumber.from(contract.totalSupply)
              .mul(BigInt(10) ** BigInt(contract.decimals))
              .toHexString()
          : BigNumber.from(contract.totalSupply).toHexString(),
    };
  }

  public async getDeployInfo(
    deployDto: DeployContractDto,
    userId: string,
  ): Promise<DeployContractResponseDto> {
    const contract: ERC20Contract = await this.ERC20ContractModel.findOne({
      _id: deployDto.contractId,
      userId,
    }).lean();
    await this.deploymentService.checkBeforeDeploy({ contract, deployDto });
    const contractName = formatContractName(contract.name);
    const options: IHbsERC20Params = Object.keys(contract.options || {}).reduce(
      (res, optionName) => {
        res[optionName] = !!contract.options[optionName];
        return res;
      },
      { contractName },
    );

    const sourceCode = contractTemplates[ContractType.erc20Contract](options);

    const aiEnabled = contract.options?.aiFunction !== undefined;

    const aiSourceCode = aiEnabled
      ? contractTemplates.aiTemplate(options)
      : undefined;

    const constructorArgs: IERC20ConstructorArgs =
      this.constructRequiredArgsFromERC20Contract(
        contract,
        ContractType.erc20Contract,
      );

    if (contract?.options?.mint?.cap) {
      constructorArgs.cap = parseUnits(
        contract.options.mint.cap.toString(),
        'wei',
      ).toHexString();
    }

    await this.deploymentService.updateDeployInfo<
      ERC20ContractDocument,
      ERC20Contract
    >({
      contract,
      deployDto,
      model: this.ERC20ContractModel,
      sourceCode,
    });

    return {
      contractName,
      sourceCode,
      constructorArgs,
      compilerVersion,
      options: contract.options,
      aiSourceCode,
    };
  }

  public async verify(verifyDto: VerifyContractDto, userId: string) {
    const contract = await this.ERC20ContractModel.findOne({
      _id: verifyDto.contractId,
      userId,
    }).lean();

    const args: IERC20ConstructorArgs =
      this.constructRequiredArgsFromERC20Contract(
        contract,
        ContractType.erc20Contract,
      );

    const types = getInitialERC20ConstructorTypes();

    if (contract?.options?.mint?.cap) {
      args.cap = parseUnits(
        contract.options.mint.cap.toString(),
        'wei',
      ).toHexString();
      types.push(SolidityType.uint256);
    }
    return this.verificationService.verify(
      this.ERC20ContractModel,
      verifyDto,
      userId,
      args,
      types,
    );
  }
}
