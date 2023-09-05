import { flatten } from 'lodash';
import { AnyContractDocument, AnyContractQuery } from '../types';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ContractType,
  IERC20Contract,
  IERC20DefContract,
  IERC721Contract,
  IICOContract,
  IBillingTransaction,
  Network,
  ContractStatus,
  IContractBase,
} from '@cryptodo/contracts';
import { ERC20Contract, ERC20ContractDocument } from '../erc20/schemas';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  GetContractResDto,
  GetContractStatsResDto,
  LandingStatsDto,
  UpdateAbiDto,
  UpdateContractStatusDto,
  UpdateSourceCodeDto,
  VerifyContractDto,
  VerifyСontractParamsDto,
} from './dto';
import { BillingApiService } from 'src/service-api/billing-api';
import {
  ERC20DefContract,
  ERC20DefContractDocument,
} from 'src/erc20/schemas/erc20-def-contract.schema';
import {
  ICOContract,
  ICOContractDocument,
} from 'src/ico/schemas/ico-contract.schema';
import {
  ERC721Contract,
  ERC721ContractDocument,
} from 'src/erc721/schemas/erc721-contract.schema';
import {
  DaoContract,
  DaoContractDocument,
} from 'src/dao/schemas/dao-contract.schema';
import {
  LotteryContract,
  LotteryContractDocument,
} from 'src/lottery/schemas/lottery-contract.schema';
import { Stats, TempStats } from './types';
import {
  AirDropContract,
  AirDropContractDocument,
} from 'src/airDrop/schemas/air-drop-contract.schema';
import { QuestService } from 'src/quest/quest.service';
import {
  MultisigContract,
  MultisigContractDocument,
} from 'src/multisig/schemas/multisig.schema';
import {
  VestingContract,
  VestingContractDocument,
} from 'src/vesting/schemas/vesting.schema';
import { TwitterService } from 'src/twitter/twitter.service';
import {
  StakingContract,
  StakingContractDocument,
} from 'src/staking/schemas/staking.schema';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(ERC20Contract.name)
    private ERC20ContractModel: Model<ERC20ContractDocument>,
    @InjectModel(ERC20DefContract.name)
    private ERC20DefContractModel: Model<ERC20DefContractDocument>,
    @InjectModel(ICOContract.name)
    private ICOContractModel: Model<ICOContractDocument>,
    @InjectModel(ERC721Contract.name)
    private ERC721ContractModel: Model<ERC721ContractDocument>,
    @InjectModel(DaoContract.name)
    private daoContractModel: Model<DaoContractDocument>,
    @InjectModel(LotteryContract.name)
    private lotteryContractModel: Model<LotteryContractDocument>,
    @InjectModel(AirDropContract.name)
    private airDropContractModel: Model<AirDropContractDocument>,
    @InjectModel(MultisigContract.name)
    private multisigContractModel: Model<MultisigContractDocument>,
    @InjectModel(VestingContract.name)
    private vestingContractModel: Model<VestingContractDocument>,
    @InjectModel(StakingContract.name)
    private stakingContractModel: Model<StakingContractDocument>,
    private billingApiService: BillingApiService,
    private questService: QuestService,
    private twitterService: TwitterService,
  ) {}

  private models: Record<any, Model<AnyContractDocument>> = {
    [ContractType.airDropContract]: this.airDropContractModel,
    [ContractType.daoContract]: this.daoContractModel,
    [ContractType.erc20Contract]: this.ERC20ContractModel,
    [ContractType.erc20DefContract]: this.ERC20DefContractModel,
    [ContractType.erc721Contract]: this.ERC721ContractModel,
    [ContractType.icoContract]: this.ICOContractModel,
    [ContractType.lotteryContract]: this.lotteryContractModel,
    [ContractType.multisigContract]: this.multisigContractModel,
    [ContractType.vestingContract]: this.vestingContractModel,
    [ContractType.stakingContract]: this.stakingContractModel,
    // [ContractType.erc4626Contract]: this.erc4626ContractModel,
  };

  private contractTypeValues = Object.values(ContractType).filter(
    (c) =>
      ![ContractType.erc4626Contract, ContractType.erc1155Contract].includes(c),
  );

  private async getAllContracts() {
    const ERC20Contracts: AnyContractQuery = this.ERC20ContractModel.find();
    const ERC20DefContracts: AnyContractQuery =
      this.ERC20DefContractModel.find();
    const ERC721Contracts: AnyContractQuery = this.ERC721ContractModel.find();
    const ICOContracts: AnyContractQuery = this.ICOContractModel.find();
    const DAOContracts: AnyContractQuery = this.daoContractModel.find();
    const lotteryContracts: AnyContractQuery = this.lotteryContractModel.find();
    const multisigContracts: AnyContractQuery =
      this.multisigContractModel.find();

    const allContracts = await Promise.all([
      ERC20Contracts,
      ERC20DefContracts,
      ERC721Contracts,
      ICOContracts,
      DAOContracts,
      lotteryContracts,
      multisigContracts,
    ]);

    return flatten(allContracts);
  }

  public async getContracts(
    userId: string,
    type?: ContractType,
  ): Promise<Array<GetContractResDto>> {
    const query: FilterQuery<ERC20ContractDocument> = { userId };
    if (type) {
      if (!Object.values(this.contractTypeValues).includes(type)) {
        throw new BadRequestException(null, `Wrong type ${type}`);
      }
      query['details.type'] = type;
    }
    let contracts = [];
    if (!type || type === ContractType.erc20Contract) {
      const ERC20Contracts: Array<IERC20Contract> =
        await this.ERC20ContractModel.find(query).lean();
      contracts = ERC20Contracts.map((contract) => ({
        ...contract,
        type: ContractType.erc20Contract,
      }));
    }
    if (!type || type === ContractType.erc20DefContract) {
      const ERC20DefContracts: Array<IERC20DefContract> =
        await this.ERC20DefContractModel.find(query).lean();
      contracts = contracts.concat(
        ERC20DefContracts.map((contract) => ({
          ...contract,
          type: ContractType.erc20DefContract,
        })),
      );
    }

    if (!type || type === ContractType.icoContract) {
      const ICOContracts: Array<IICOContract> =
        await this.ICOContractModel.find(query).lean();
      contracts = contracts.concat(
        ICOContracts.map((contract) => ({
          ...contract,
          type: ContractType.icoContract,
        })),
      );
    }

    if (!type || type === ContractType.erc721Contract) {
      const ERC721Contracts: Array<IERC721Contract> =
        await this.ERC721ContractModel.find(query).lean();
      contracts = contracts.concat(
        ERC721Contracts.map((contract) => ({
          ...contract,
          type: ContractType.erc721Contract,
        })),
      );
    }
    if (!type || type === ContractType.daoContract) {
      const daoContracts = await this.daoContractModel.find(query).lean();
      contracts = contracts.concat(
        daoContracts.map((contract) => ({
          ...contract,
          type: ContractType.daoContract,
        })),
      );
    }

    if (!type || type === ContractType.lotteryContract) {
      const lotteryContracts = await this.lotteryContractModel
        .find(query)
        .lean();
      contracts = contracts.concat(
        lotteryContracts.map((contract) => ({
          ...contract,
          type: ContractType.lotteryContract,
        })),
      );
    }

    if (!type || type === ContractType.airDropContract) {
      const airDropContracts = await this.airDropContractModel
        .find(query)
        .lean();
      contracts = contracts.concat(
        airDropContracts.map((contract) => ({
          ...contract,
          type: ContractType.airDropContract,
        })),
      );
    }

    if (!type || type === ContractType.multisigContract) {
      const multisigDropContracts = await this.multisigContractModel
        .find(query)
        .lean();
      contracts = contracts.concat(
        multisigDropContracts.map((contract) => ({
          ...contract,
          type: ContractType.multisigContract,
        })),
      );
    }

    if (!type || type === ContractType.vestingContract) {
      const vestingContracts = await this.vestingContractModel
        .find(query)
        .lean();
      contracts = contracts.concat(
        vestingContracts.map((contract) => ({
          ...contract,
          type: ContractType.vestingContract,
        })),
      );
    }

    if (!type || type === ContractType.stakingContract) {
      const vestingContracts = await this.stakingContractModel
        .find(query)
        .lean();
      contracts = contracts.concat(
        vestingContracts.map((contract) => ({
          ...contract,
          type: ContractType.stakingContract,
        })),
      );
      return contracts;
    }

    const transactions: Array<IBillingTransaction> =
      await this.billingApiService.getUserTransactions(userId);
    const modifiedContracts: Array<GetContractResDto> = contracts;
    if (transactions?.length) {
      contracts.forEach((contract: GetContractResDto, index: number) => {
        const modifiedContract: GetContractResDto = contract;
        const contractTransaction = transactions.find(
          (transaction) => transaction.contractId === contract._id.toString(),
        );
        if (contractTransaction) {
          modifiedContract.transactionStatus = contractTransaction.status;
        }
        modifiedContracts[index] = modifiedContract;
      });
    }
    //TODO:  add ERC721 contracts
    return modifiedContracts;
  }

  public async updateContractStatus(params: UpdateContractStatusDto) {
    const contract = await this.ERC20ContractModel.findByIdAndUpdate(
      params.contractId,
      { status: params.newStatus },
    );
    if (!contract) {
      throw new NotFoundException(
        null,
        `Contract ${params.contractId} does not exists`,
      );
    }
    return contract;
  }

  public async getLandingStats(): Promise<LandingStatsDto> {
    const promises = [
      this.getTotalContractsCount(),
      this.twitterService.getFollowersCount(),
    ];
    const [contractsCount, communityMembers] = await Promise.all(promises);
    return {
      contractsCount,
      communityMembers: Math.ceil(communityMembers * 1.32),
    };
  }

  public async getTotalContractsCount(): Promise<number> {
    const results = await Promise.all<Promise<number>>(
      Object.values(this.contractTypeValues).map(async (contractType) => {
        return this.models[contractType].count();
      }),
    );
    return results.reduce((curr, prev) => prev + curr, 0);
  }

  public async getContractsStats(): Promise<GetContractStatsResDto> {
    const tempStats: TempStats = {};
    const stats: Stats = { total: 0 };
    await Promise.all(
      Object.values(this.contractTypeValues).map(async (contractType) => {
        await Promise.all(
          Object.values(Network).map(async (network) => {
            if (!tempStats[contractType]) {
              tempStats[contractType] = {
                [network]: {
                  mainnet: {
                    deployed: 0,
                    total: 0,
                  },
                  testnet: {
                    deployed: 0,
                    total: 0,
                  },
                  total: 0,
                },
              };
            }
            if (!tempStats[contractType][network]) {
              tempStats[contractType][network] = {
                mainnet: {
                  deployed: 0,
                  total: 0,
                },
                testnet: {
                  deployed: 0,
                  total: 0,
                },
                total: 0,
              };
            }
            tempStats[contractType][network].testnet.deployed +=
              await this.models[contractType]
                .count({
                  network,
                  testnet: true,
                  status: ContractStatus.deployed,
                })
                .lean();
            tempStats[contractType][network].mainnet.deployed +=
              await this.models[contractType]
                .count({
                  network,
                  testnet: false,
                  status: ContractStatus.deployed,
                })
                .lean();
            tempStats[contractType][network].testnet.total += await this.models[
              contractType
            ]
              .count({
                network,
                testnet: true,
              })
              .lean();
            tempStats[contractType][network].mainnet.total += await this.models[
              contractType
            ]
              .count({
                network,
                testnet: false,
              })
              .lean();
            tempStats[contractType][network].total =
              tempStats[contractType][network].testnet.total +
              tempStats[contractType][network].mainnet.total;
          }),
        );
      }),
    );

    Object.values(tempStats).forEach((tempStat) => {
      Object.keys(tempStat).forEach((value) => {
        const network = value as Network;
        if (!stats[network]) {
          stats[network] = {
            mainnet: {
              deployed: 0,
              total: 0,
            },
            testnet: {
              deployed: 0,
              total: 0,
            },
            total: 0,
          };
        }
        stats[network].mainnet.deployed += tempStat[network].mainnet.deployed;
        stats[network].mainnet.total += tempStat[network].mainnet.total;
        stats[network].testnet.deployed += tempStat[network].testnet.deployed;
        stats[network].testnet.total += tempStat[network].testnet.total;
        stats[network].total += tempStat[network].total;
      });
    });
    //
    Object.values(stats).forEach((stat) => {
      if (typeof stat !== 'number') {
        stats.total += stat.total;
      }
    });
    return stats;
  }

  public async updateTestnetsInfo(
    params: VerifyСontractParamsDto,
    verifyDto: VerifyContractDto,
    userId: string,
  ) {
    const verifiedContract: Omit<IContractBase, '_id'> = await this.models[
      params.contractType
    ].findOne({
      _id: verifyDto.contractId,
      userId,
    });
    if (
      ![
        Network.bitTorrent,
        Network.optimism,
        Network.ethereum,
        Network.shardeum,
      ].includes(verifiedContract.network)
    ) {
      await this.questService.updateUserQuestInfo({
        contractType: params.contractType,
        net: verifiedContract.testnet ? 'testnet' : 'mainnet',
        network: verifiedContract.network,
        userId: userId,
      });
    }
  }

  public async updateSourceCode({
    contractId,
    contractType,
    sourceCode,
  }: UpdateSourceCodeDto) {
    await this.models[contractType].updateOne(
      { _id: contractId },
      { sourceCode },
    );
  }

  public async updateAbi({ contractId, contractType, abi }: UpdateAbiDto) {
    await this.models[contractType].updateOne({ _id: contractId }, { abi });
  }
}
