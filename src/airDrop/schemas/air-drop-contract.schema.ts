import {
  AirDropType,
  IAirDropContract,
  IAirDropOptions,
} from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseContract } from 'src/contract/schemas/base-contract.schema';

export type AirDropContractDocument = AirDropContract & Document;

@Schema()
export class AirDropContract
  extends BaseContract
  implements Omit<IAirDropContract, '_id'>
{
  @Prop({
    enum: AirDropType,
    type: SchemaTypes.String,
    required: true,
  })
  airDropType: AirDropType;

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  options?: IAirDropOptions;
}

export const AirDropContractSchema =
  SchemaFactory.createForClass(AirDropContract);
