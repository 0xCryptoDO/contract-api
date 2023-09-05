import { ILotteryContract, LotteryType } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { GetBaseContractResDto } from 'src/contract/dto/base-contract/get-base-contract.dto';

export class GetLotteryContractResDto
  extends GetBaseContractResDto
  implements ILotteryContract
{
  @ApiProperty({ type: String, required: false })
  description?: string;

  @ApiProperty({ enum: LotteryType })
  lotteryType: LotteryType;

  @ApiProperty({ type: Number })
  ownerFee: number;

  @ApiProperty({ type: Number })
  ticketsPrice: number;

  @ApiProperty({ type: Number })
  ticketsAmount: number;

  @ApiProperty({ type: Number })
  startTime: number;

  @ApiProperty({ type: Number })
  endTime: number;

  @ApiProperty({ type: Number, isArray: true })
  winnersPercentage: number[];

  @ApiProperty({ type: Number, isArray: true })
  valuePercantage: number[];
}
