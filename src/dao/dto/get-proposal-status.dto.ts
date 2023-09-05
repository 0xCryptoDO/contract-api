import { Network } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class GetProposalStatusDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ enum: Network })
  @IsEnum(Network)
  network: Network;
}
