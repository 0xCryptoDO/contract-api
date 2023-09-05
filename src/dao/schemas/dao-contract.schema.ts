import { IDaoOptions } from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseContract } from 'src/contract/schemas';
import { IDaoContract } from '../types';

export type DaoContractDocument = DaoContract & Document;

@Schema()
export class DaoContract
  extends BaseContract
  implements Omit<IDaoContract, '_id'>
{
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  symbol: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  contractName: string;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  quorum: number;

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  partners: Array<string>;

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  shares: Array<number>;

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  options?: IDaoOptions;
}

export const DaoContractSchema = SchemaFactory.createForClass(DaoContract);

DaoContractSchema.index({ userId: 1 });
DaoContractSchema.index({ network: 1, testnet: 1, status: 1 });
