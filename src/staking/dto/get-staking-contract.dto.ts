import { ApiProperty } from '@nestjs/swagger';
import { GetBaseContractResDto } from 'src/contract/dto/base-contract/get-base-contract.dto';

export class GetStakingContractResDto extends GetBaseContractResDto {
  //implements IVestingContract
  @ApiProperty()
  token: string;

  @ApiProperty()
  minStake: number;

  @ApiProperty()
  maxStake: number;

  @ApiProperty()
  lockPeriods: number[];

  @ApiProperty()
  amounts: number[];

  @ApiProperty()
  isEarlyWithdrawal: boolean;
}
