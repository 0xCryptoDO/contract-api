import { ApiProperty } from '@nestjs/swagger';
import { GetBaseContractResDto } from 'src/contract/dto/base-contract/get-base-contract.dto';
import { IDaoContract } from '../types/dao.types';

export class GetDaoContractResDto
  extends GetBaseContractResDto
  implements IDaoContract
{
  @ApiProperty()
  contractName: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty({ type: Number })
  quorum: number;

  @ApiProperty({ type: Array<string> })
  partners: Array<string>;

  @ApiProperty({ type: Number, isArray: true })
  shares: Array<number>;
}
