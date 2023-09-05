import { IERC721Contract, IERC721Options } from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseContract } from 'src/contract/schemas';

export type ERC721ContractDocument = ERC721Contract & Document;

@Schema()
export class ERC721Contract
  extends BaseContract
  implements Omit<IERC721Contract, '_id'>
{
  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  contractName: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  symbol: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  owner: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  totalSupply: string;

  @Prop({
    type: SchemaTypes.Number,
    required: false,
  })
  tokenPerTx: number;

  @Prop({
    type: SchemaTypes.Number,
    required: false,
  })
  tokenPerWallet: number;

  @Prop({
    type: SchemaTypes.Number,
    required: false,
  })
  price: number;

  @Prop({
    type: SchemaTypes.Number,
    required: false,
  })
  timeForReveal: number;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  founder: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  uri: string;

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  options?: IERC721Options;
}

export const ERC721ContractSchema =
  SchemaFactory.createForClass(ERC721Contract);

ERC721ContractSchema.index({ userId: 1 });
ERC721ContractSchema.index({ network: 1, testnet: 1, status: 1 });
