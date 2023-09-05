import { IMultisigNewContract, IMultisigOptions } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEthereumAddress,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateBaseContractDto } from 'src/contract/dto/base-contract/create-base-contract.dto';

class MultisigOptionsDto implements IMultisigOptions {
  @ApiProperty()
  @IsOptional()
  @IsString()
  aiFunction?: string;
}

export class CreateMultisigContractDto
  extends CreateBaseContractDto
  implements IMultisigNewContract
{
  @IsString()
  @ApiProperty()
  targetContract: string;

  @IsNumber()
  @ApiProperty()
  quorum: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsEthereumAddress({ each: true })
  @ApiProperty({ type: Array<string> })
  owners: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({ type: Number, isArray: true })
  weights: number[];

  @IsArray({})
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ type: Array<string> })
  functionNames: string[];

  @IsOptional()
  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => MultisigOptionsDto)
  options: MultisigOptionsDto;
}
