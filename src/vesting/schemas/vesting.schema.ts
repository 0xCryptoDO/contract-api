import { IVestingContract, VestingType } from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseContract } from 'src/contract/schemas/base-contract.schema';

export type VestingContractDocument = VestingContract & Document;

@Schema()
export class VestingContract
  extends BaseContract
  implements Omit<IVestingContract, '_id'>
{
  @Prop({
    enum: VestingType,
    type: SchemaTypes.String,
    required: true,
  })
  vestingType: VestingType;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  token: string;

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  addresses: string[];

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  amounts: number[];

  @Prop({
    type: SchemaTypes.Array,
    required: false,
  })
  unlockDates?: number[];

  @Prop({
    type: SchemaTypes.Array,
    required: false,
  })
  unlockPercents?: number[];

  @Prop({
    type: SchemaTypes.Number,
    required: false,
  })
  lockDuration?: number;
}

export const VestingContractSchema =
  SchemaFactory.createForClass(VestingContract);

VestingContractSchema.index({ userId: 1 });
VestingContractSchema.index({ network: 1, testnet: 1, status: 1 });
