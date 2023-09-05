import { Module } from '@nestjs/common';
import { BillingApiService } from './billing-api/billing-api.service';
import { UserApiService } from './user-api/user-api.service';

@Module({
  providers: [BillingApiService, UserApiService],
})
export class ServiceApiModule {}
