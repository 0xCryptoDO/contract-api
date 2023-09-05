import {
  CombinedContractOptions,
  ContractStatus,
  IContractBase,
  Network,
  TransactionStatus,
} from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class GetBaseContractResDto implements IContractBase {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ enum: ContractStatus })
  status: ContractStatus;

  @ApiProperty({ enum: TransactionStatus })
  transactionStatus?: TransactionStatus;

  @ApiProperty({ type: String })
  userId: Types.ObjectId;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  verified?: boolean;

  @ApiProperty({ required: false })
  testnetAddress?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ enum: Network })
  network: Network;

  @ApiProperty({ type: Boolean })
  testnet: boolean;

  @ApiProperty({ type: String, required: true })
  abi: string;

  @ApiProperty({ type: String, required: false })
  sourceCode?: string;

  @ApiProperty({ required: false })
  options?: CombinedContractOptions;
}
