import { Module } from '@nestjs/common';
import { StakingController } from './staking.controller';
import { StakingService } from './staking.service';
import { AuthModule } from '@cryptodo/common';
import { ContractModule } from 'src/contract/contract.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StakingContract, StakingContractSchema } from './schemas';

@Module({
  imports: [
    AuthModule,
    ContractModule,
    MongooseModule.forFeature([
      { name: StakingContract.name, schema: StakingContractSchema },
    ]),
  ],
  controllers: [StakingController],
  providers: [StakingService],
})
export class StakingModule {}
