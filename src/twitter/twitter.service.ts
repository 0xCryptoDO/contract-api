import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TwitterApi } from 'twitter-api-v2';
import { FOLLOWERS_CACHE_KEY } from './twitter.constants';

@Injectable()
export class TwitterService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  public async getFollowersCount(): Promise<number> {
    let followersCount = await this.cacheManager.get<number>(
      FOLLOWERS_CACHE_KEY,
    );
    if (!followersCount) {
      const user = await this.client.v2.me({
        'user.fields': ['public_metrics'],
      });
      followersCount = user.data.public_metrics.followers_count;
      await this.cacheManager.set<number>(FOLLOWERS_CACHE_KEY, followersCount, {
        ttl: 6912,
      });
    }
    return followersCount;
  }
}
