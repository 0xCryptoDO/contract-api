import { IContractBase, INewContractBase } from '@cryptodo/contracts';

export interface IDaoContractBase {
  contractName: string;
  symbol: string;
  quorum: number;
  partners: Array<string>;
  shares: Array<number>;
}

export interface IDaoContract extends IContractBase, IDaoContractBase {}

export interface IDaoNewContract extends INewContractBase, IDaoContractBase {}

export interface IDaoConstructorArgs {
  name: string;
  symbol: string;
  quorum: number;
  partners: Array<string>;
  shares: Array<number>;
  apiUrl: string;
}

export interface IHbsDaoParams {
  contractName: string;
}
