import { Module } from '@nestjs/common';
import { ERC20Controller } from './erc20.controller';
import { ERC20Service } from './erc20.service';
import { AuthModule } from '@cryptodo/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ERC20Contract,
  ERC20ContractSchema,
} from './schemas/erc20-contract.schema';
import {
  ERC20DefContract,
  ERC20DefContractSchema,
} from './schemas/erc20-def-contract.schema';
import { ContractModule } from 'src/contract/contract.module';
import { ERC20DefService } from './erc20Def.service';

@Module({
  imports: [
    AuthModule,
    ContractModule,
    MongooseModule.forFeature([
      { name: ERC20Contract.name, schema: ERC20ContractSchema },
      { name: ERC20DefContract.name, schema: ERC20DefContractSchema },
    ]),
  ],
  controllers: [ERC20Controller],
  providers: [ERC20Service, ERC20DefService],
})
export class ERC20Module {}
