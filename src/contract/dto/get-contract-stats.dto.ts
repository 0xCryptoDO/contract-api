import { ApiProperty } from '@nestjs/swagger';
import { Stats, StatsBase } from '../types';

export class DeepStatsBaseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  deployed: number;
}

export class StatsBaseDto implements StatsBase {
  @ApiProperty()
  total: number;

  @ApiProperty()
  testnet: DeepStatsBaseDto;

  @ApiProperty()
  mainnet: DeepStatsBaseDto;
}

export class GetContractStatsResDto implements Stats {
  @ApiProperty()
  total: number;

  @ApiProperty()
  BSC?: StatsBaseDto;

  @ApiProperty()
  ETHEREUM?: StatsBaseDto;

  @ApiProperty()
  POLYGON?: StatsBaseDto;

  @ApiProperty()
  AURORA?: StatsBaseDto;

  @ApiProperty()
  OPTIMISM?: StatsBaseDto;

  @ApiProperty()
  AVALANCHE?: StatsBaseDto;

  @ApiProperty()
  MANTLE?: StatsBaseDto;

  @ApiProperty()
  OKC?: StatsBaseDto;

  @ApiProperty()
  SHARDEUM?: StatsBaseDto;

  @ApiProperty()
  BITTORRENT?: StatsBaseDto;
}
