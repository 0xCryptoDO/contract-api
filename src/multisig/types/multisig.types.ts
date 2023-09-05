import { IMultisigContractBase } from '@cryptodo/contracts';

export interface IHbsMultisigParams {
  contractName: string;
  functionInterfaces: Array<string>;
  functionDefinitions: Array<string>;
}

export type IMultisigConstructorArgs = Omit<
  IMultisigContractBase,
  'functionNames'
>;
