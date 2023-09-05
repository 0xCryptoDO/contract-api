import {
  IVestingNewContract,
  IVestingOptions,
  VestingType,
} from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateBaseContractDto } from 'src/contract/dto/base-contract/create-base-contract.dto';

export class VestingContractOptionsDto implements IVestingOptions {
  @ApiProperty()
  @IsOptional()
  @IsString()
  aiFunction?: string;
}

export class CreateVestingContractDto
  extends CreateBaseContractDto
  implements IVestingNewContract
{
  @IsNotEmpty()
  @IsEthereumAddress()
  @ApiProperty()
  token: string;

  @IsArray()
  @IsEthereumAddress({ each: true })
  @ApiProperty({ type: Array<string> })
  addresses: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @ApiProperty({ type: Number, isArray: true })
  amounts: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @ApiProperty({ type: Number, isArray: true })
  unlockDates?: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @ApiProperty({ type: Number, isArray: true })
  unlockPercents?: number[];

  @IsNumber({})
  @IsOptional()
  @ApiProperty({ type: Number })
  lockDuration?: number;

  @IsEnum(VestingType)
  @IsNotEmpty()
  @ApiProperty({ enum: VestingType })
  vestingType: VestingType;

  @IsOptional()
  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => VestingContractOptionsDto)
  options: VestingContractOptionsDto;
}
