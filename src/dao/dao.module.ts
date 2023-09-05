import { AuthModule } from '@cryptodo/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DaoController } from './dao.controller';
import { DaoService } from './dao.service';
import { DaoVoting, DaoVotingSchema } from './schemas/dao-voting.schema';
import { DaoContract, DaoContractSchema } from './schemas/dao-contract.schema';
import { ContractModule } from 'src/contract/contract.module';

@Module({
  imports: [
    AuthModule,
    ContractModule,
    MongooseModule.forFeature([
      { name: DaoContract.name, schema: DaoContractSchema },
      { name: DaoVoting.name, schema: DaoVotingSchema },
    ]),
  ],
  controllers: [DaoController],
  providers: [DaoService],
})
export class DaoModule {}
