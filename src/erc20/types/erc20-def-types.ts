import { Network } from '@cryptodo/contracts';

export interface IHbsERC20DefParams {
  contractName: string;
  burn?: boolean;
  mint?: boolean;
  blacklist?: boolean;
  pause?: boolean;
  taxBurn?: boolean;
  team?: boolean;
  liquidity?: boolean;
  burnFee?: number;
}

export interface IERC20DefConstructorArgs {
  initialOwner: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  cap?: string;
  router?: string;
  teamFee?: number;
  teamWallet?: string;
  liquidityFee?: number;
}

export interface IERC20DefVerificationParams {
  contractAddress: string;
  contractName: string;
  sourceCode: string;
  constructorArguements: Array<IERC20DefConstructorArgs>;
  testnet: boolean;
  network: Network;
}
