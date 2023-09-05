import { IMultisigContract, IMultisigOptions } from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseContract } from 'src/contract/schemas/base-contract.schema';

export type MultisigContractDocument = MultisigContract & Document;

@Schema()
export class MultisigContract
  extends BaseContract
  implements Omit<IMultisigContract, '_id'>
{
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  targetContract: string;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  quorum: number;

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  owners: string[];

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  weights: number[];

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  functionNames: string[];

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  options?: IMultisigOptions;
}

export const MultisigContractSchema =
  SchemaFactory.createForClass(MultisigContract);

MultisigContractSchema.index({ userId: 1 });
MultisigContractSchema.index({ network: 1, testnet: 1, status: 1 });
