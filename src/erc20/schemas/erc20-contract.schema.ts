import { IERC20Contract, IERC20Options } from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseContract } from 'src/contract/schemas/base-contract.schema';

export type ERC20ContractDocument = ERC20Contract & Document;

@Schema()
export class ERC20Contract
  extends BaseContract
  implements Omit<IERC20Contract, '_id'>
{
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  initialOwner: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  symbol: string;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  decimals: number;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  totalSupply: string;

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  options?: IERC20Options;
}

export const ERC20ContractSchema = SchemaFactory.createForClass(ERC20Contract);

ERC20ContractSchema.index({ userId: 1 });
ERC20ContractSchema.index({ network: 1, testnet: 1, status: 1 });
