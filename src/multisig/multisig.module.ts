import { Module } from '@nestjs/common';
import { MultisigController } from './multisig.controller';
import { MultisigService } from './multisig.service';
import { AuthModule } from '@cryptodo/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MultisigContract,
  MultisigContractSchema,
} from './schemas/multisig.schema';

import { ContractModule } from 'src/contract/contract.module';

@Module({
  imports: [
    AuthModule,
    ContractModule,
    MongooseModule.forFeature([
      { name: MultisigContract.name, schema: MultisigContractSchema },
    ]),
  ],
  controllers: [MultisigController],
  providers: [MultisigService],
})
export class MultisigModule {}
