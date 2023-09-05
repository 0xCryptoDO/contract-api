import { config } from 'dotenv';

config();
import { AuthModule, AuthService } from '@cryptodo/common';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import axios from 'axios';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractModule } from './contract/contract.module';
import { ERC20Module } from './erc20/erc20.module';
import { ServiceApiModule } from './service-api/services-api.module';
import { ICOModule } from './ico/ico.module';
import { ERC721Module } from './erc721/erc721.module';
import { DaoModule } from './dao/dao.module';
import { LotteryModule } from './lottery/lottery.module';
import { FaucetModule } from './faucet/faucet.module';
import { AirDropModule } from './airDrop/air-drop.module';
import { QuestModule } from './quest/quest.module';
import { MultisigModule } from './multisig/multisig.module';
import { AiContractsModule } from './ai-contracts/ai-contracts.module';
import { StakingModule } from './staking/staking.module';
import { VestingModule } from './vesting/vesting.module';
import { TwitterModule } from './twitter/twitter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'staging')
          .default('development'),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().optional(),
        FAUCET_WALLET_PRIVATE_KEY: Joi.string().required(),
        BSCSCAN_API_KEY: Joi.string().required(),
        ETHERSCAN_API_KEY: Joi.string().required(),
        AURORASCAN_API_KEY: Joi.string().required(),
        OPTIMISMSCAN_API_KEY: Joi.string().required(),
        OKCSCAN_API_KEY: Joi.string().required(),
        BITGERTSCAN_API_KEY: Joi.string().required(),
        BITTORRENTSCAN_API_KEY: Joi.string().required(),
        FANTOMSCAN_API_KEY: Joi.string().required(),
        CRONOSSCAN_API_KEY: Joi.string().required(),
        ARBITRUMSCAN_API_KEY: Joi.string().required(),
        BASESCAN_API_KEY: Joi.string().required(),
      }),
      validationOptions: { abortEarly: true },
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${
        process.env.DB_HOST
      }:${process.env.DB_PORT || 27017}/ContractApi`,
    ),
    CacheModule.register({ isGlobal: true }),
    ContractModule,
    AuthModule,
    ERC20Module,
    ServiceApiModule,
    ICOModule,
    ERC721Module,
    DaoModule,
    LotteryModule,
    FaucetModule,
    AirDropModule,
    QuestModule,
    MultisigModule,
    AiContractsModule,
    VestingModule,
    TwitterModule,
    StakingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private authService: AuthService) {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${authService.serviceToken}`;
  }
}
