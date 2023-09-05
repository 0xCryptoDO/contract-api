import { BadRequestException, Injectable } from '@nestjs/common';
import { IHbsMultisigParams, IMultisigConstructorArgs } from './types';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { camelCase } from 'lodash';
import { MultisigContract, MultisigContractDocument } from './schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { VerifyContractDto } from 'src/contract/dto/verify-contract.dto';
import {
  DeployContractDto,
  DeployContractResponseDto,
} from 'src/contract/dto/deploy-contract.dto';
import { getInitialMultisigConstructorTypes } from './multisig.constants';
import { VerificationService } from 'src/contract/verification.service';
import { AbiService } from 'src/contract/abi/abi.service';
import { IAbiElement } from 'src/contract/abi/types/abi.types';
import { ContractCommonService } from 'src/contract/contract.common.service';
import { CreateMultisigContractDto } from './dto/multisig';
import { DeploymentService } from 'src/contract/deployment.service';
import { compilerVersion } from 'src/constants';
export const contractTemplate = Handlebars.compile<IHbsMultisigParams>(
  fs.readFileSync(path.resolve('./src/multisig/hbs/multisig.sol.hbs'), 'utf-8'),
);
export const contractAiTemplate = Handlebars.compile<IHbsMultisigParams>(
  fs.readFileSync(
    path.resolve('./src/multisig/hbs/multisigAI.sol.hbs'),
    'utf-8',
  ),
);

@Injectable()
export class MultisigService {
  constructor(
    @InjectModel(MultisigContract.name)
    private multisigContractModel: Model<MultisigContractDocument>,
    private verificationSercive: VerificationService,
    private abiService: AbiService,
    private contractCommonSercice: ContractCommonService,
    private deploymentService: DeploymentService,
  ) {}

  public async getDeployInfo(
    deployDto: DeployContractDto,
    userId: string,
  ): Promise<DeployContractResponseDto> {
    const contract = await this.multisigContractModel
      .findOne({
        _id: deployDto.contractId,
        userId,
      })
      .lean();
    await this.deploymentService.checkBeforeDeploy({ contract, deployDto });
    let contractName = camelCase(contract.name);
    contractName = contractName.charAt(0).toUpperCase() + contractName.slice(1);
    const abi = await this.abiService.getAbi(
      contract.network,
      contract.targetContract,
      deployDto.testnet,
    );
    let writeFunctions = this.abiService.getWriteFunctionsFromAbi(abi);
    writeFunctions = writeFunctions.filter((writeFunction) =>
      contract.functionNames.includes(writeFunction.name),
    );
    const functionDefinitions =
      this.constructFunctionDefinitions(writeFunctions);
    const functionInterfaces = this.constructFunctionInterfaces(writeFunctions);

    const options: IHbsMultisigParams = {
      contractName,
      functionDefinitions,
      functionInterfaces,
    };

    const sourceCode = contractTemplate(options);

    const aiEnabled = contract.options?.aiFunction !== undefined;

    const aiSourceCode = aiEnabled ? contractAiTemplate(options) : undefined;

    const constructorArgs: IMultisigConstructorArgs =
      this.constructRequiredArgsFromMultisigContract(contract);
    await this.deploymentService.updateDeployInfo<
      MultisigContractDocument,
      MultisigContract
    >({
      contract,
      deployDto,
      model: this.multisigContractModel,
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
    const contract = await this.multisigContractModel
      .findOne({
        _id: verifyDto.contractId,
        userId,
      })
      .lean();

    const args: IMultisigConstructorArgs =
      this.constructRequiredArgsFromMultisigContract(contract);

    const types = getInitialMultisigConstructorTypes();

    return this.verificationSercive.verify(
      this.multisigContractModel,
      verifyDto,
      userId,
      args,
      types,
    );
  }

  private constructRequiredArgsFromMultisigContract(
    contract: MultisigContract,
  ): IMultisigConstructorArgs {
    return {
      owners: contract.owners,
      weights: contract.weights,
      quorum: contract.quorum,
      targetContract: contract.targetContract,
    };
  }

  public constructFunctionDefinitions(abiElements: Array<IAbiElement>) {
    return abiElements.map((abiElement) => {
      const args = this.abiService.constructArgsFromAbiElementInputs(
        abiElement.inputs,
      );
      const argsWithTypes =
        this.abiService.constructArgsWithTypesFromAbiElementInputs(
          abiElement.inputs,
        );
      return `function ${abiElement.name}(
        uint256 nonce${argsWithTypes.length ? ', ' : ''}
      ${argsWithTypes}
    ) external {
        bytes32 txHash = keccak256(abi.encodePacked(nonce${
          args.length ? ', ' : ''
        }${args}));
        require(
            !confirmedTransactions[msg.sender][txHash],
            "Transaction already confirmed"
        );
        confirmedTransactions[msg.sender][txHash] = true;
        if (isConfirmed(txHash)) {
            executableInstance.${abiElement.name}(${args});
            delete confirmedTransactions[msg.sender][txHash];
        }   
    }`;
    });
  }

  public constructFunctionInterfaces(abiElements: Array<IAbiElement>) {
    return abiElements.map((abiElement) => {
      const argsWithTypes =
        this.abiService.constructArgsWithTypesFromAbiElementInputs(
          abiElement.inputs,
        );
      return `function ${abiElement.name}(${argsWithTypes}) external;`;
    });
  }

  public async create(body: CreateMultisigContractDto, userId: string) {
    const availableFunctions = await this.abiService.getContractWriteFunctions(
      body.targetContract,
      { network: body.network, testnet: body.testnet },
    );
    body.functionNames.forEach((name) => {
      if (!availableFunctions.includes(name)) {
        throw new BadRequestException(
          `${name} function does not exist in target contract`,
        );
      }
    });
    return this.contractCommonSercice.createContract(
      userId,
      body,
      this.multisigContractModel,
    );
  }
}
