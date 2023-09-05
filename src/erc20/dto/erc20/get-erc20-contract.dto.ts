import { IERC20Contract, IERC20Options } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { GetBaseContractResDto } from 'src/contract/dto/base-contract/get-base-contract.dto';

export class GetERC20ContractResDto
  extends GetBaseContractResDto
  implements IERC20Contract
{
  @ApiProperty()
  initialOwner: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  decimals: number;

  @ApiProperty()
  totalSupply: string;

  @ApiProperty({ required: false })
  options?: IERC20Options;
}
