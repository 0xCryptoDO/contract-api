import { ContractType, Network } from '@cryptodo/contracts';

export interface StatsBase {
  total: number;
  testnet: { total: number; deployed: number };
  mainnet: { total: number; deployed: number };
}

export type Stats = Partial<Record<Network, StatsBase>> & { total: number };

export type TempStats = Partial<
  Record<ContractType, Partial<Record<Network, StatsBase>>>
>;
