import { ApiProperty } from '@nestjs/swagger';

export class GetLotteryInfoResDto {
  @ApiProperty({ type: String })
  pool: string;

  @ApiProperty({ type: Date })
  endTime: Date;

  @ApiProperty({ type: Number })
  ticketsAmount: number;

  @ApiProperty({ type: Number })
  ticketsBought: number;

  @ApiProperty({ type: String })
  description: string;
}
