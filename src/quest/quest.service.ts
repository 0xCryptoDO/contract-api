import { BadRequestException, Injectable } from '@nestjs/common';
import { UserQuest, UserQuestDocument } from './schemas/user-quest.schema';
import { Model, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUpdateUserInfoParams } from './types/quest.type';
import { ContractType, IUserQuestProgress } from '@cryptodo/contracts';
import {
  MAX_AVAILABLE_POINTS,
  QUESTS,
  referralPointCoef,
  socicalPoints,
  tweetPoints,
} from './quest.constants';
import { LeadBoardRequestDto } from './dto/user-quest.dto';
import { UserApiService } from 'src/service-api/user-api/user-api.service';

@Injectable()
export class QuestService {
  constructor(
    @InjectModel(UserQuest.name)
    private userQuestModel: Model<UserQuestDocument>,
    private userApiService: UserApiService,
  ) {}

  public async getUserQuestInfo(userId: string) {
    const optionsToUpdate: UpdateQuery<UserQuestDocument> = {};

    optionsToUpdate.$setOnInsert = {
      progress: {},
      referralPoints: 0,
      totalPoints: 0,
      socialPoints: 0,
      socicalMediaProgress: {
        telegram: false,
        discord: false,
        twitter: false,
        twitterPosted: false,
      },
    };

    const userQuest = await this.userQuestModel
      .findOneAndUpdate({ userId }, optionsToUpdate, {
        new: true,
        upsert: true,
      })
      .lean();
    if (!userQuest.wallet) {
      const user = await this.userApiService.getById(userId);
      await this.userQuestModel.updateOne({ userId }, { wallet: user.wallet });
    }
    return { userQuest, maxPoints: MAX_AVAILABLE_POINTS };
  }

  public async setSocialPoints(userId: string) {
    const { userQuest } = await this.getUserQuestInfo(userId);

    await this.userQuestModel.updateOne(
      { _id: userQuest._id },
      {
        socialPoints: (userQuest.socialPoints || 0) + socicalPoints * 4,
        socicalMediaProgress: {
          ...userQuest.socicalMediaProgress,
          telegram: true,
          discord: true,
          twitter: true,
        },
      },
    );
  }

  public async setTweetPoints(tweetLink: string, userId: string) {
    if (!tweetLink.includes('twitter.com') || !tweetLink.includes('status')) {
      throw new BadRequestException('Wrong tweet link');
    }
    const { userQuest } = await this.getUserQuestInfo(userId);

    if (!userQuest.socicalMediaProgress?.twitterPosted) {
      await this.userQuestModel.updateOne(
        { _id: userQuest._id },
        {
          socialPoints: (userQuest.socialPoints || 0) + tweetPoints,
          socicalMediaProgress: {
            ...(userQuest?.socicalMediaProgress || {}),
            twitterPosted: true,
          },
          tweetLink,
        },
      );
    }
  }

  public async getTotalQuestInfo() {
    return QUESTS;
  }

  public async getLeadBoard(params: LeadBoardRequestDto) {
    const items = await this.userQuestModel
      .aggregate()
      .project({
        userId: 1,
        wallet: 1,
        totalPoints: {
          $sum: ['$totalPoints', '$referralPoints', '$socialPoints'],
        },
      })
      .sort({ totalPoints: -1 })
      .skip(params.offset)
      .limit(params.limit);
    const count = await this.userQuestModel.count();
    return { items, count };
  }

  public async updateUserQuestInfo({
    contractType,
    userId,
    net,
    network,
  }: IUpdateUserInfoParams) {
    if (contractType === ContractType.erc20DefContract) {
      contractType = ContractType.erc20Contract;
    }
    const { userQuest } = await this.getUserQuestInfo(userId);
    const progress: IUserQuestProgress = userQuest.progress;
    let isPointWasAdded = true;
    if (!progress[contractType]) {
      progress[contractType] = { [network]: { [net]: 1 } };
    } else if (!progress[contractType][network]) {
      progress[contractType][network] = { [net]: 1 };
    } else if (!progress[contractType][network][net]) {
      progress[contractType][network][net] = 1;
    } else if (
      QUESTS[contractType]?.maxNumberOfCreatedContracts[net] >
      progress[contractType][network][net]
    ) {
      progress[contractType][network][net]++;
    } else {
      isPointWasAdded = false;
    }
    let wallet = userQuest.wallet;
    const user = await this.userApiService.getById(userId);
    if (!wallet) {
      wallet = user.wallet;
    }
    if (user.referralUserId && isPointWasAdded) {
      const { userQuest: referralQuest } = await this.getUserQuestInfo(
        user.referralUserId,
      );
      let referralPoints = referralQuest.referralPoints;
      const point = QUESTS[contractType].points[net] * referralPointCoef;
      referralPoints = (referralPoints || 0) + point;
      await this.userQuestModel.updateOne(
        { userId: referralQuest.userId },
        { referralPoints },
      );
    }
    const totalPoints = this.calculateUserPoints(progress);
    await this.userQuestModel.updateOne(
      { userId: userId },
      { totalPoints, progress, wallet },
    );
    return;
  }

  public calculateUserPoints(progress: IUserQuestProgress) {
    if (!progress) {
      return 0;
    }
    const totalPoints = Object.keys(progress).reduce((sum, contractType) => {
      return (
        sum +
        Object.keys(progress[contractType]).reduce((sum1, network) => {
          return (
            sum1 +
            Object.keys(progress[contractType][network]).reduce((sum3, net) => {
              return (
                sum3 + QUESTS[contractType as ContractType].points[net]
                // progress[contractType][network][net]
              );
            }, 0)
          );
        }, 0)
      );
    }, 0);
    return totalPoints;
  }

  public calculateSoicalPoints(userQuest: UserQuest) {
    let res = 0;
    if (userQuest?.socicalMediaProgress?.discord) {
      res += socicalPoints;
    }
    if (userQuest?.socicalMediaProgress?.telegram) {
      res += socicalPoints + socicalPoints;
    }

    if (userQuest?.socicalMediaProgress?.twitter) {
      res += socicalPoints;
    }

    if (userQuest?.socicalMediaProgress?.twitterPosted) {
      res += tweetPoints;
    }
    return res;
  }

  public async recalculateAllQuests() {
    const userQuests = await this.userQuestModel.find().cursor();
    await userQuests.eachAsync(async (userQuest) => {
      try {
        const totalPoints = this.calculateUserPoints(userQuest.progress);
        const socialPoints = this.calculateSoicalPoints(userQuest);
        await this.userQuestModel.updateOne(
          { userId: userQuest.userId },
          { totalPoints, socialPoints },
        );
      } catch (err) {
        throw err;
      }
    });
  }
}
