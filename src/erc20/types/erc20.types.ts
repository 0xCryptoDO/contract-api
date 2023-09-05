export interface IHbsERC20Params {
  contractName: string;
  burn?: boolean;
  mint?: boolean;
  blacklist?: boolean;
  pause?: boolean;
}

export interface IERC20ConstructorArgs {
  initialOwner: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  cap?: string;
}
