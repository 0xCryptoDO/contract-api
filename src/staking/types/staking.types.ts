export interface IStakingWithTariffsConstructorArgs {
  token: string;
  minStake: number;
  maxStake: number;
  lockPeriods: number[];
  rewardRates: number[];
  isEarlyWithdrawal: boolean;
  penalty: number;
}

export interface IStakingWithoutTariffsConstructorArgs {
  token: string;
  minStake: number;
  maxStake: number;
  lockPeriod: number;
  rewardRate: number;
  isEarlyWithdrawal: boolean;
  penalty: number;
}
