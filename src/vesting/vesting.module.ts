import { Module } from '@nestjs/common';
import { VestingController } from './vesting.controller';
import { VestingService } from './vesting.service';
import { AuthModule } from '@cryptodo/common';
import { ContractModule } from 'src/contract/contract.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VestingContract,
  VestingContractSchema,
} from './schemas/vesting.schema';

@Module({
  imports: [
    AuthModule,
    ContractModule,
    MongooseModule.forFeature([
      { name: VestingContract.name, schema: VestingContractSchema },
    ]),
  ],
  controllers: [VestingController],
  providers: [VestingService],
})
export class VestingModule {}
