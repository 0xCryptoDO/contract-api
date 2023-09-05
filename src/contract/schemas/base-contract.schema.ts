import {
  CombinedContractOptions,
  ContractStatus,
  IContractBase,
  Network,
} from '@cryptodo/contracts';
import { Prop } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

/**
 * Helper shchema, useful for extending contracts
 */
export class BaseContract implements Omit<IContractBase, '_id'> {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    enum: ContractStatus,
    type: SchemaTypes.String,
    required: true,
  })
  status: ContractStatus;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  name: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    enum: Network,
  })
  network: Network;

  @Prop({
    type: SchemaTypes.Boolean,
    required: true,
  })
  testnet: boolean;

  @Prop({
    type: SchemaTypes.Date,
    required: true,
  })
  createdAt: Date;

  @Prop({
    type: SchemaTypes.Boolean,
    required: false,
  })
  verified?: boolean;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  address?: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  testnetAddress?: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  abi: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  sourceCode?: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  txHash?: string;

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  options?: CombinedContractOptions;
}
