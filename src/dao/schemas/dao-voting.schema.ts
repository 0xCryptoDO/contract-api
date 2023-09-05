import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type DaoVotingDocument = DaoVoting & Document;

@Schema()
export class DaoVoting {
  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  proposalId: number;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  contractAddress: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  network: string;

  @Prop({
    type: SchemaTypes.Array,
    required: true,
  })
  signs: Array<string>;
}

export const DaoVotingSchema = SchemaFactory.createForClass(DaoVoting);
