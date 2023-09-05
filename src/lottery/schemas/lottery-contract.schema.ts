import {
  ILotteryContract,
  ILotteryOptions,
  LotteryType,
} from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseContract } from 'src/contract/schemas/base-contract.schema';

export type LotteryContractDocument = LotteryContract & Document;

@Schema()
export class LotteryContract
  extends BaseContract
  implements Omit<ILotteryContract, '_id'>
{
  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  description?: string;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  ownerFee: number;

  @Prop({
    enum: LotteryType,
    type: SchemaTypes.String,
    required: true,
  })
  lotteryType: LotteryType;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  ticketsPrice: number;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  ticketsAmount: number;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  startTime: number;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  endTime: number;

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  winnersPercentage: number[];

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  valuePercantage: number[];

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  options?: ILotteryOptions;
}

export const LotteryContractSchema =
  SchemaFactory.createForClass(LotteryContract);

LotteryContractSchema.index({ userId: 1 });
LotteryContractSchema.index({ network: 1, testnet: 1, status: 1 });
