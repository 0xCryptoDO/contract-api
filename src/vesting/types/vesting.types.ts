export interface IVestingConstructorArgs {
  token: string;
  addresses: Array<string>;
  amounts: Array<number>;
  unlockDates: Array<number>;
  unlockPercents: Array<number>;
}

export interface IVestingLockerConstructorArgs {
  token: string;
  addresses: Array<string>;
  amounts: Array<number>;
  lockDuration: number;
}
