import { VestingType, IVestingContract } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { GetBaseContractResDto } from 'src/contract/dto/base-contract/get-base-contract.dto';

export class GetVestingContractResDto
  extends GetBaseContractResDto
  implements IVestingContract
{
  lotteryType: VestingType;
  @ApiProperty()
  txHash?: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  addresses: string[];

  @ApiProperty()
  amounts: number[];

  @ApiProperty()
  unlockDates?: number[];

  @ApiProperty()
  unlockPercents?: number[];

  @ApiProperty()
  lockDuration?: number;

  @ApiProperty({ enum: VestingType })
  vestingType: VestingType;
}
