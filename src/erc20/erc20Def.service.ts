import { Injectable } from '@nestjs/common';
import { ContractType } from '@cryptodo/contracts';
import {
  IERC20ConstructorArgs,
  IHbsERC20DefParams,
  IERC20DefConstructorArgs,
} from './types';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ERC20DefContract, ERC20DefContractDocument } from './schemas';
import { VerifyContractDto } from 'src/contract/dto/verify-contract.dto';
import {
  DeployContractDto,
  DeployContractResponseDto,
} from 'src/contract/dto/deploy-contract.dto';
import { getInitialERC20ConstructorTypes } from './erc20.constants';
import { SolidityType } from 'src/types';
import { VerificationService } from 'src/contract/verification.service';
import { formatContractName } from 'src/utils/format-contact-name';
import { DeploymentService } from 'src/contract/deployment.service';
import { compilerVersion } from 'src/constants';
export const contractTemplates = {
  [ContractType.erc20DefContract]: Handlebars.compile<IHbsERC20DefParams>(
    fs.readFileSync(path.resolve('./src/erc20/hbs/DefToken.sol.hbs'), 'utf-8'),
  ),
  aiTemplate: Handlebars.compile<IHbsERC20DefParams>(
    fs.readFileSync(
      path.resolve('./src/erc20/hbs/DefTokenAI.sol.hbs'),
      'utf-8',
    ),
  ),
};

@Injectable()
export class ERC20DefService {
  constructor(
    @InjectModel(ERC20DefContract.name)
    private ERC20DefContractModel: Model<ERC20DefContractDocument>,
    private verificationService: VerificationService,
    private deploymentService: DeploymentService,
  ) {}

  private constructRequiredArgsFromERC20Contract(
    contract: ERC20DefContract,
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
    const contract: ERC20DefContract = await this.ERC20DefContractModel.findOne(
      {
        _id: deployDto.contractId,
        userId,
      },
    ).lean();
    await this.deploymentService.checkBeforeDeploy({ contract, deployDto });
    let contractName = formatContractName(contract.name);
    contractName = contractName.charAt(0).toUpperCase() + contractName.slice(1);
    const options: IHbsERC20DefParams = Object.keys(
      contract.options || {},
    ).reduce(
      (res, optionName) => {
        res[optionName] = !!contract.options[optionName];
        return res;
      },
      { contractName },
    );

    if ((contract as ERC20DefContract).options?.taxBurn) {
      (options as IHbsERC20DefParams).burnFee = (
        contract as ERC20DefContract
      ).options.taxBurn.burnFee;
    }

    const sourceCode =
      contractTemplates[ContractType.erc20DefContract](options);

    const aiEnabled = contract.options?.aiFunction !== undefined;

    const aiSourceCode = aiEnabled
      ? contractTemplates.aiTemplate(options)
      : undefined;

    const constructorArgs: IERC20DefConstructorArgs =
      this.constructRequiredArgsFromERC20Contract(
        contract,
        ContractType.erc20DefContract,
      );

    if (contract?.options?.mint?.cap) {
      constructorArgs.cap = parseUnits(
        contract.options.mint.cap.toString(),
        'wei',
      ).toHexString();
    }
    if (contract?.options?.liquidity?.router) {
      constructorArgs.router = contract?.options?.liquidity?.router;
    }

    if (contract?.options?.team?.teamFee !== undefined) {
      constructorArgs.teamFee = contract.options.team.teamFee;
    }

    if (contract?.options?.team?.teamWallet) {
      constructorArgs.teamWallet = contract.options.team.teamWallet;
    }

    if (contract?.options?.liquidity?.liquidityFee) {
      constructorArgs.liquidityFee = contract.options.liquidity.liquidityFee;
    }
    await this.deploymentService.updateDeployInfo<
      ERC20DefContractDocument,
      ERC20DefContract
    >({
      contract,
      deployDto,
      model: this.ERC20DefContractModel,
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
    const contract: ERC20DefContract = await this.ERC20DefContractModel.findOne(
      {
        _id: verifyDto.contractId,
        userId,
      },
    ).lean();
    const args: IERC20DefConstructorArgs =
      this.constructRequiredArgsFromERC20Contract(
        contract,
        ContractType.erc20DefContract,
      );

    const types = getInitialERC20ConstructorTypes();

    if (contract?.options?.mint?.cap) {
      args.cap = parseUnits(
        contract.options.mint.cap.toString(),
        'wei',
      ).toHexString();
      types.push(SolidityType.uint256);
    }

    if (contract?.options?.liquidity?.router) {
      args.router = contract?.options?.liquidity?.router;
      types.push(SolidityType.address);
    }

    if (contract?.options?.team?.teamFee !== undefined) {
      args.teamFee = contract.options.team.teamFee;
      types.push(SolidityType.uint256);
    }

    if (contract?.options?.team?.teamWallet) {
      args.teamWallet = contract.options.team.teamWallet;
      types.push(SolidityType.address);
    }

    if (contract?.options?.liquidity?.liquidityFee) {
      args.liquidityFee = contract.options.liquidity.liquidityFee;
      types.push(SolidityType.uint256);
    }

    return this.verificationService.verify(
      this.ERC20DefContractModel,
      verifyDto,
      userId,
      args,
      types,
    );
  }
}
