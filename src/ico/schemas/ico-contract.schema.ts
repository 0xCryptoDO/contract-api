import { IICOContract, IIcoOptions } from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseContract } from 'src/contract/schemas/base-contract.schema';

export type ICOContractDocument = ICOContract & Document;

@Schema()
export class ICOContract
  extends BaseContract
  implements Omit<IICOContract, '_id'>
{
  @Prop({
    type: SchemaTypes.Number,
    required: true,
    default: 2,
  })
  version: number;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  token: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  price: string;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  lockup: number;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  maxPerWallet: string;

  @Prop({
    type: SchemaTypes.Number,
    required: false,
  })
  decimals: number;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  owner: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  receiverAddress: string;

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  options?: IIcoOptions;
}

export const ICOContractSchema = SchemaFactory.createForClass(ICOContract);

ICOContractSchema.index({ userId: 1 });
ICOContractSchema.index({ network: 1, testnet: 1, status: 1 });
