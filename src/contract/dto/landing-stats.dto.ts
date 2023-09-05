import { ApiProperty } from '@nestjs/swagger';

export class LandingStatsDto {
  @ApiProperty()
  contractsCount: number;

  @ApiProperty()
  communityMembers: number;
}
