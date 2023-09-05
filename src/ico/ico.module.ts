import { Module } from '@nestjs/common';
import { ICOService } from './ico.service';
import { ICOController } from './ico.controller';
import { AuthModule } from '@cryptodo/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ICOContract, ICOContractSchema } from './schemas/ico-contract.schema';
import { ContractModule } from 'src/contract/contract.module';

@Module({
  imports: [
    AuthModule,
    ContractModule,
    MongooseModule.forFeature([
      { name: ICOContract.name, schema: ICOContractSchema },
    ]),
  ],
  providers: [ICOService],
  controllers: [ICOController],
})
export class ICOModule {}
