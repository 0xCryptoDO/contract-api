import { BigNumber } from 'ethers';

export interface ILotteryConstructorArgs {
  ownerFee: number;
  ticketsPrice: BigNumber;
  ticketsAmount: number;
  startTime: number;
  endTime: number;
  winnersPercentage: Array<number>;
  valuePercantage: Array<number>;
}
