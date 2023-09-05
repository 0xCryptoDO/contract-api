import { LotteryContract } from './lottery/schemas/lottery-contract.schema';
import { DaoContract } from './dao/schemas/dao-contract.schema';
import { ICOContract } from './ico/schemas/ico-contract.schema';
import { ERC721Contract } from './erc721/schemas/erc721-contract.schema';
import { ERC20DefContract } from './erc20/schemas/erc20-def-contract.schema';
import { ERC20Contract } from './erc20/schemas/erc20-contract.schema';
import { Document, Query, Types } from 'mongoose';
import { MultisigContract } from './multisig/schemas/multisig.schema';
import { VestingContract } from './vesting/schemas/vesting.schema';
import { StakingContract } from './staking/schemas/staking.schema';
import { AirDropContract } from './airDrop/schemas/air-drop-contract.schema';
export interface IGetJsonInputParams {
  sourceCode: string;
  contractName: string;
}

export enum SolidityType {
  address = 'address',
  string = 'string',
  uint8 = 'uint8',
  uint256 = 'uint256',
  arrayUint256 = 'uint256[]',
  arrayAddress = 'address[]',
  bytes32 = 'bytes32',
  uint = 'uint',
  uint32 = 'uint32',
  arrayUint8 = 'uint8[]',
  bool = 'bool',
}

export interface IVerifyParams {
  guid: string;
  module: string;
  action: string;
  apikey?: string;
}

export type AnyContract =
  | ERC20Contract
  | ERC20DefContract
  | ERC721Contract
  | ICOContract
  | DaoContract
  | LotteryContract
  | MultisigContract
  | VestingContract
  | StakingContract
  | AirDropContract;

export type AnyContractDocument = AnyContract & Document;

export type AnyContractQuery = Query<
  (AnyContractDocument & {
    _id: Types.ObjectId;
  })[],
  AnyContractDocument & {
    _id: Types.ObjectId;
  }
>;
