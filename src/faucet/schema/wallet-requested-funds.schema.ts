import { Network } from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type WalletRequestedFundsDocument = WalletRequestedFunds & Document;

@Schema()
export class WalletRequestedFunds {
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  address: string;

  @Prop({
    type: SchemaTypes.Date,
    required: true,
  })
  lastFundedDate: Date;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    enum: Network,
  })
  network: Network;
}

export const WalletRequestedFundsSchema =
  SchemaFactory.createForClass(WalletRequestedFunds);
