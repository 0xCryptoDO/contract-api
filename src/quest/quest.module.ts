import { AuthModule } from '@cryptodo/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserQuest, UserQuestSchema } from './schemas/user-quest.schema';
import { QuestController } from './quest.controller';
import { QuestService } from './quest.service';
import { UserApiService } from 'src/service-api/user-api/user-api.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: UserQuest.name, schema: UserQuestSchema },
    ]),
  ],
  controllers: [QuestController],
  providers: [QuestService, UserApiService],
})
export class QuestModule {}
