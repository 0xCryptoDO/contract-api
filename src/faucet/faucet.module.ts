import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FaucetController } from './faucet.controller';
import { FaucetService } from './faucet.service';
import {
  WalletRequestedFunds,
  WalletRequestedFundsSchema,
} from './schema/wallet-requested-funds.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WalletRequestedFunds.name, schema: WalletRequestedFundsSchema },
    ]),
  ],
  controllers: [FaucetController],
  providers: [FaucetService],
})
export class FaucetModule {}
