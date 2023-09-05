import { Module } from '@nestjs/common';
import { StakingContract, StakingContractSchema } from '../staking/schemas';
import { StakingService } from '../staking/staking.service';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { AuthModule } from '@cryptodo/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ERC20Contract,
  ERC20ContractSchema,
} from '../erc20/schemas/erc20-contract.schema';
import { BillingApiService } from 'src/service-api/billing-api/billing-api.service';
import { ERC20Service } from 'src/erc20/erc20.service';
import { ICOService } from 'src/ico/ico.service';
import {
  ERC20DefContract,
  ERC20DefContractSchema,
} from 'src/erc20/schemas/erc20-def-contract.schema';
import {
  ICOContract,
  ICOContractSchema,
} from 'src/ico/schemas/ico-contract.schema';
import {
  ERC721Contract,
  ERC721ContractSchema,
} from 'src/erc721/schemas/erc721-contract.schema';
import { ERC721Service } from 'src/erc721/erc721.service';
import {
  DaoContract,
  DaoContractSchema,
} from 'src/dao/schemas/dao-contract.schema';
import { DaoService } from 'src/dao/dao.service';
import { DaoVoting, DaoVotingSchema } from 'src/dao/schemas/dao-voting.schema';
import {
  LotteryContract,
  LotteryContractSchema,
} from 'src/lottery/schemas/lottery-contract.schema';
import { LotteryService } from 'src/lottery/lottery.service';
import { AirDropService } from 'src/airDrop/air-drop.service';
import {
  AirDropContract,
  AirDropContractSchema,
} from 'src/airDrop/schemas/air-drop-contract.schema';
import { QuestService } from 'src/quest/quest.service';
import {
  UserQuest,
  UserQuestSchema,
} from 'src/quest/schemas/user-quest.schema';
import { UserApiService } from 'src/service-api/user-api/user-api.service';
import { DeploymentService } from './deployment.service';
import { VerificationService } from './verification.service';
import { ContractCommonService } from './contract.common.service';
import {
  MultisigContract,
  MultisigContractSchema,
} from 'src/multisig/schemas/multisig.schema';
import { MultisigService } from 'src/multisig/multisig.service';
import { AbiService } from './abi/abi.service';
import { AbiController } from './abi/abi.controller';
import { ServiceApiModule } from 'src/service-api/services-api.module';
import { ERC20DefService } from 'src/erc20/erc20Def.service';
import {
  VestingContract,
  VestingContractSchema,
} from 'src/vesting/schemas/vesting.schema';
import { VestingService } from 'src/vesting/vesting.service';
import { TwitterModule } from 'src/twitter/twitter.module';

@Module({
  imports: [
    AuthModule,
    ServiceApiModule,
    TwitterModule,
    MongooseModule.forFeature([
      { name: ERC20Contract.name, schema: ERC20ContractSchema },
      { name: ERC20DefContract.name, schema: ERC20DefContractSchema },
      { name: ICOContract.name, schema: ICOContractSchema },
      { name: ERC721Contract.name, schema: ERC721ContractSchema },
      { name: DaoContract.name, schema: DaoContractSchema },
      { name: DaoVoting.name, schema: DaoVotingSchema },
      { name: LotteryContract.name, schema: LotteryContractSchema },
      { name: AirDropContract.name, schema: AirDropContractSchema },
      { name: MultisigContract.name, schema: MultisigContractSchema },
      { name: VestingContract.name, schema: VestingContractSchema },
      { name: StakingContract.name, schema: StakingContractSchema },
      { name: UserQuest.name, schema: UserQuestSchema },
    ]),
  ],
  providers: [
    VerificationService,
    DeploymentService,
    ContractService,
    ContractCommonService,
    AbiService,
    BillingApiService,
    ERC20Service,
    ERC20DefService,
    ICOService,
    ERC721Service,
    DaoService,
    LotteryService,
    AirDropService,
    MultisigService,
    VestingService,
    StakingService,
    QuestService,
    UserApiService,
  ],
  controllers: [ContractController, AbiController],
  exports: [
    DeploymentService,
    VerificationService,
    ContractCommonService,
    AbiService,
  ],
})
export class ContractModule {}
