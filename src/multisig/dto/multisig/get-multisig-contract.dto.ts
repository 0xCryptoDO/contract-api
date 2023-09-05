import { IMultisigContract } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { GetBaseContractResDto } from 'src/contract/dto/base-contract/get-base-contract.dto';

export class GetMultisigContractResDto
  extends GetBaseContractResDto
  implements IMultisigContract
{
  @ApiProperty()
  targetContract: string;

  @ApiProperty({ type: Number })
  quorum: number;

  @ApiProperty({ type: String, isArray: true })
  owners: string[];

  @ApiProperty({ type: Number, isArray: true })
  weights: number[];

  @ApiProperty({ type: Array, isArray: true })
  functionNames: string[];
}
