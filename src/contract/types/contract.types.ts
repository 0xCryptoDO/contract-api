import { Network } from '@cryptodo/contracts';
import { SolidityType } from 'src/types';

export interface IVerificationArgs {
  apikey: string;
  module: 'contract';
  action: 'verifysourcecode';
  sourceCode: string;
  contractaddress: string;
  codeformat: 'solidity-single-file';
  contractName: string;
  compilerversion: string;
  optimizationUsed: 1 | 0;
  evmversion: string;
  licenseType: number;
  constructorArguements?: string;
}

export interface IMantleVerificationArgs {
  module: string;
  action: string;
  contractSourceCode: any;
  addressHash: any;
  codeformat: string;
  name: any;
  compilerVersion: any;
  optimization: string;
  evmversion: string;
  licenseType: number;
  constructorArguments?: string;
}

export interface IVerifyResponseData {
  status: string;
  message: string;
  result: string;
}

export interface IVerificationParams<ConstructorArgs> {
  contractAddress: string;
  contractName: string;
  sourceCode: string;
  constructorArguements?: Array<ConstructorArgs>;
  testnet: boolean;
  network: Network;
  types?: Array<SolidityType>;
  compilerVersion?: string;
}
