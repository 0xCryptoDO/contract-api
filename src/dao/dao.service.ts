import { Network } from '@cryptodo/contracts';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  DeployContractDto,
  DeployContractResponseDto,
} from 'src/contract/dto/deploy-contract.dto';
import {
  DaoContract,
  DaoContractDocument,
  DaoVoting,
  DaoVotingDocument,
} from './schemas';
import fs from 'fs';
import path from 'path';
import { IDaoConstructorArgs, IDaoContract, IHbsDaoParams } from './types';
import { getRpcUrl } from 'src/utils';
import { ethers } from 'ethers';
import { VerifyContractDto } from 'src/contract/dto/verify-contract.dto';
import Handlebars from 'handlebars';
import { getInitialDaoConstructorTypes } from './dao.constants';
import contractAbi from './abi/abi';
import { GetDaoContractResDto } from './dto';
import { DeploymentService } from 'src/contract/deployment.service';
import { VerificationService } from 'src/contract/verification.service';
import { compilerVersion } from 'src/constants';

const daoContractTemplate = Handlebars.compile<IHbsDaoParams>(
  fs.readFileSync(path.resolve('./src/dao/hbs/dao.sol.hbs'), 'utf-8'),
);

const daoAiContractTemplate = Handlebars.compile<IHbsDaoParams>(
  fs.readFileSync(path.resolve('./src/dao/hbs/daoAI.sol.hbs'), 'utf-8'),
);

@Injectable()
export class DaoService {
  constructor(
    @InjectModel(DaoContract.name)
    private daoContractModel: Model<DaoContractDocument>,
    @InjectModel(DaoVoting.name)
    private daoVotingModel: Model<DaoVotingDocument>,
    private deploymentService: DeploymentService,
    private verificationService: VerificationService,
  ) {}

  private constructRequiredArgsFromDaoContract(
    contract: DaoContract,
  ): IDaoConstructorArgs {
    return {
      name: contract.name,
      symbol: contract.symbol,
      quorum: contract.quorum,
      partners: contract.partners,
      shares: contract.shares,
      apiUrl: `https://contract-api.daotrip.xyz/dao/${contract.network}/`, //todo remove hardcode
    };
  }

  public async getDaos(userId: string): Promise<Array<GetDaoContractResDto>> {
    const query: FilterQuery<DaoContractDocument> = { userId };
    const daoContracts: Array<IDaoContract> = await this.daoContractModel
      .find(query)
      .lean();

    return daoContracts;
  }

  public async getDeployInfo(
    deployDto: DeployContractDto,
    userId: string,
  ): Promise<DeployContractResponseDto> {
    const contract: DaoContract = await this.daoContractModel
      .findOne({
        _id: deployDto.contractId,
        userId,
      })
      .lean();
    await this.deploymentService.checkBeforeDeploy({ contract, deployDto });

    const contractName = 'Dao'; //camelCase(contract.contractName);

    const hbsOptions: IHbsDaoParams = {
      contractName: contractName,
    };

    const sourceCode: string = daoContractTemplate(hbsOptions);
    const constructorArgs = this.constructRequiredArgsFromDaoContract(contract);

    const aiEnabled = contract.options?.aiFunction !== undefined;

    const aiSourceCode = aiEnabled
      ? daoAiContractTemplate(hbsOptions)
      : undefined;

    await this.deploymentService.updateDeployInfo<
      DaoContractDocument,
      DaoContract
    >({
      contract,
      deployDto,
      model: this.daoContractModel,
      sourceCode,
    });

    return {
      contractName,
      constructorArgs,
      sourceCode,
      compilerVersion,
      options: contract.options,
      aiSourceCode,
    };
  }

  public async verify(verifyDto: VerifyContractDto, userId: string) {
    const daoContract: DaoContract = await this.daoContractModel
      .findOne({
        _id: verifyDto.contractId,
        userId,
      })
      .lean();

    const args = this.constructRequiredArgsFromDaoContract(daoContract);
    const types = getInitialDaoConstructorTypes();
    return this.verificationService.verify(
      this.daoContractModel,
      verifyDto,
      userId,
      args,
      types,
    );
  }

  public async proposalVote(
    proposalId: number,
    contractAddress: string,
    sign: string,
    network: string,
  ) {
    const proposal = await this.daoVotingModel.findOne({
      proposalId,
      contractAddress,
      network,
    });
    if (!proposal) {
      await this.daoVotingModel.create({
        proposalId,
        contractAddress,
        signs: [sign],
        network,
      });
      return { vote: 'ok' };
    } else {
      proposal.signs.push(sign);
      proposal.save();
      return { vote: 'ok' };
    }
  }
  public async getProposalStatus(
    proposalId: number,
    contractAddress: string,
    network: Network,
  ) {
    const proposal = await this.daoVotingModel.findOne({
      proposalId,
      contractAddress,
      network,
    });
    if (!proposal) return { id: proposalId, status: false, signs: [] };
    else {
      //todo: cheeck for testnet
      const provider = new ethers.providers.JsonRpcProvider(getRpcUrl(network));
      const daoContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider,
      );
      const contractProposal = await daoContract.getProposalById(proposalId);
      const trxHash = await daoContract.getTxHash(
        contractProposal.target,
        contractProposal.data,
        contractProposal.value,
        contractProposal.nonce,
        contractProposal.timestamp,
      );
      const status = await daoContract._checkSigs(proposal.signs, trxHash);
      return { id: proposalId, status: status, signs: proposal.signs };
    }
  }
}
