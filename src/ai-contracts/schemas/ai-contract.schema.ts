import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { IAiContractFunction } from '../types';

export type AiContractDocument = AiContract & Document;

@Schema()
export class AiContract {
  @Prop({
    type: SchemaTypes.String,
    required: true,
    unique: true,
  })
  type: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  basePrompt: string;

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  functions: IAiContractFunction[];

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  description: string;
}

export const AiContractSchema = SchemaFactory.createForClass(AiContract);
