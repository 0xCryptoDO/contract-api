import { ApiProperty } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
export class VoteDaoProposalDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  proposalId: number;

  @IsNotEmpty()
  @IsEthereumAddress()
  @ApiProperty()
  contractAddress: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sign: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  network: string;
}
