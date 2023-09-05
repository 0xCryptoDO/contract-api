import {
  ContractType,
  ISocialMedialProgress,
  IUserQuest,
  IUserQuestProgress,
  Network,
} from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ProgressNetDto {
  @ApiProperty()
  testnet: number;
  @ApiProperty()
  mainnet: number;
}
class ProgressNetworkDto {
  @ApiProperty({ type: ProgressNetDto })
  [Network.ethereum]: ProgressNetDto;

  @ApiProperty({ type: ProgressNetDto })
  [Network.bsc]: ProgressNetDto;
}
export class UserQuestProgressDto implements IUserQuestProgress {
  @ApiProperty({ type: ProgressNetworkDto })
  [ContractType.erc20DefContract]: ProgressNetworkDto;

  @ApiProperty({ type: ProgressNetworkDto })
  [ContractType.erc721Contract]: ProgressNetworkDto;

  @ApiProperty({ type: ProgressNetworkDto })
  [ContractType.icoContract]: ProgressNetworkDto;
}
export class IUserQuestDto implements IUserQuest {
  @ApiProperty()
  socicalMediaProgress?: ISocialMedialProgress;

  @ApiProperty()
  socialPoints: number;
  @ApiProperty()
  wallet: string;

  @ApiProperty()
  totalPoints: number;

  @ApiProperty()
  referralPoints: number;

  @ApiProperty()
  userId: string;

  @Type(() => UserQuestProgressDto)
  @ApiProperty()
  progress: UserQuestProgressDto;
}

export class GetUserQuestResDto {
  @ApiProperty({ type: IUserQuestDto })
  userQuest: IUserQuestDto;

  @ApiProperty()
  maxPoints: number;
}

export class LeadBoardRequestDto {
  limit: number;
  offset: number;
}
