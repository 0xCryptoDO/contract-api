import { Module } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { LotteryController } from './lottery.controller';
import { AuthModule } from '@cryptodo/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LotteryContract,
  LotteryContractSchema,
} from './schemas/lottery-contract.schema';
import { ContractModule } from 'src/contract/contract.module';

@Module({
  imports: [
    AuthModule,
    ContractModule,
    MongooseModule.forFeature([
      { name: LotteryContract.name, schema: LotteryContractSchema },
    ]),
  ],
  providers: [LotteryService],
  controllers: [LotteryController],
})
export class LotteryModule {}
