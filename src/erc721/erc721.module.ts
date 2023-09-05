import { AuthModule } from '@cryptodo/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ERC721Controller } from './erc721.controller';
import { ERC721Service } from './erc721.service';
import {
  ERC721Contract,
  ERC721ContractSchema,
} from './schemas/erc721-contract.schema';
import { ContractModule } from 'src/contract/contract.module';

@Module({
  imports: [
    AuthModule,
    ContractModule,
    MongooseModule.forFeature([
      { name: ERC721Contract.name, schema: ERC721ContractSchema },
    ]),
  ],
  controllers: [ERC721Controller],
  providers: [ERC721Service],
})
export class ERC721Module {}
