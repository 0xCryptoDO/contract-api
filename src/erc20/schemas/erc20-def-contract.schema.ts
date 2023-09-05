import { IERC20DefContract, IERC20DefOptions } from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseContract } from 'src/contract/schemas/base-contract.schema';

export type ERC20DefContractDocument = ERC20DefContract & Document;

@Schema()
export class ERC20DefContract
  extends BaseContract
  implements Omit<IERC20DefContract, '_id'>
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
  options?: IERC20DefOptions;
}

export const ERC20DefContractSchema =
  SchemaFactory.createForClass(ERC20DefContract);

ERC20DefContractSchema.index({ userId: 1 });
ERC20DefContractSchema.index({ network: 1, testnet: 1, status: 1 });
