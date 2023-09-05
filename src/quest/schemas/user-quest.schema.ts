import {
  ISocialMedialProgress,
  IUserQuest,
  IUserQuestProgress,
} from '@cryptodo/contracts';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type UserQuestDocument = UserQuest & Document;

@Schema()
export class UserQuest implements Omit<IUserQuest, '_id'> {
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  userId: string;

  @Prop({
    type: SchemaTypes.Date,
    required: true,
  })
  startTime: Date;

  @Prop({
    type: SchemaTypes.Mixed,
  })
  progress: IUserQuestProgress;

  @Prop({
    type: SchemaTypes.Number,
    default: 0,
  })
  referralPoints: number;

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  socicalMediaProgress?: ISocialMedialProgress;

  @Prop({
    type: SchemaTypes.Number,
    default: 0,
  })
  totalPoints: number;

  @Prop({
    type: SchemaTypes.String,
  })
  wallet: string;

  @Prop({
    type: SchemaTypes.Number,
    default: 0,
  })
  socialPoints: number;

  @Prop({
    type: SchemaTypes.String,
  })
  tweetLink?: string;
}

export const UserQuestSchema = SchemaFactory.createForClass(UserQuest);
