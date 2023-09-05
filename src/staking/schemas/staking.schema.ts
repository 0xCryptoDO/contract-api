import {
  IStakingOptions,
  IStakingContract,
} from '@cryptodo/contracts/lib/types/staking/staking-contract.types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseContract } from 'src/contract/schemas/base-contract.schema';

export type StakingContractDocument = StakingContract & Document;

@Schema()
export class StakingContract
  extends BaseContract
  implements Omit<IStakingContract, '_id'>
{
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  token: string;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  minStake: number;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  maxStake: number;

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  lockPeriods: number[];

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  rewardRates: number[];

  @Prop({
    type: SchemaTypes.Boolean,
    required: true,
  })
  isEarlyWithdrawal: boolean;

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  options?: IStakingOptions;
}

export const StakingContractSchema =
  SchemaFactory.createForClass(StakingContract);

StakingContractSchema.index({ userId: 1 });
StakingContractSchema.index({ network: 1, testnet: 1, status: 1 });
