import { Module } from '@nestjs/common';
import { AirDropService } from './air-drop.service';
import { AirDropController } from './air-drop.controller';
import { AuthModule } from '@cryptodo/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AirDropContract,
  AirDropContractSchema,
} from './schemas/air-drop-contract.schema';
import { ContractModule } from 'src/contract/contract.module';

@Module({
  imports: [
    AuthModule,
    ContractModule,
    MongooseModule.forFeature([
      { name: AirDropContract.name, schema: AirDropContractSchema },
    ]),
  ],
  providers: [AirDropService],
  controllers: [AirDropController],
})
export class AirDropModule {}
