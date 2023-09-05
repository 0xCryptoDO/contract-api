import { IERC20DefContract, IERC20DefOptions } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { GetBaseContractResDto } from 'src/contract/dto/base-contract/get-base-contract.dto';

export class GetERC20DefContractResDto
  extends GetBaseContractResDto
  implements IERC20DefContract
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
  options?: IERC20DefOptions;
}
