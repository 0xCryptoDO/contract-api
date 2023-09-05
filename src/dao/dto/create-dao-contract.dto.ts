import { IDaoOptions } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { CreateBaseContractDto } from 'src/contract/dto/base-contract/create-base-contract.dto';
import { IDaoNewContract } from '../types';

class DaoOptionsDto implements IDaoOptions {
  @ApiProperty()
  @IsOptional()
  @IsString()
  aiFunction?: string;
}

export class CreateDaoContractDto
  extends CreateBaseContractDto
  implements IDaoNewContract
{
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?![0-9])/, {
    message: 'Contract name must not start with a number',
  })
  @ApiProperty()
  contractName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  symbol: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  quorum: number;

  @IsArray()
  @IsEthereumAddress({ each: true })
  @ApiProperty({ type: Array<string> })
  partners: Array<string>;

  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ type: Number, isArray: true })
  shares: Array<number>;

  @IsOptional()
  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => DaoOptionsDto)
  options: DaoOptionsDto;
}
