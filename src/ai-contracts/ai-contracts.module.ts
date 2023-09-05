import { Module } from '@nestjs/common';
import { AiContractsService } from './ai-contracts.service';
import { AiContractsController } from './ai-contracts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AiContract, AiContractSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiContract.name, schema: AiContractSchema },
    ]),
  ],
  providers: [AiContractsService],
  controllers: [AiContractsController],
})
export class AiContractsModule {}
