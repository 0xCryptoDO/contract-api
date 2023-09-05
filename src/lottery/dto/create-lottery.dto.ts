import {
  ILotteryNewContract,
  ILotteryOptions,
  LotteryType,
} from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateBaseContractDto } from 'src/contract/dto/base-contract/create-base-contract.dto';

class LotteryOptionsDto implements ILotteryOptions {
  @ApiProperty()
  @IsOptional()
  @IsString()
  aiFunction?: string;
}

export class CreateLotteryContractDto
  extends CreateBaseContractDto
  implements ILotteryNewContract
{
  @IsString()
  @MaxLength(512)
  @IsOptional()
  description?: string;

  @IsEnum(LotteryType)
  @IsNotEmpty()
  @ApiProperty({ enum: LotteryType })
  lotteryType: LotteryType;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  ownerFee: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  ticketsPrice: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Min(10)
  ticketsAmount: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  startTime: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  endTime: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @ApiProperty({ type: 'integer', isArray: true })
  winnersPercentage: number[];

  @IsArray()
  @Min(0, { each: true })
  @IsNumber({}, { each: true })
  @ApiProperty({ type: 'integer', isArray: true })
  valuePercantage: number[];

  @IsOptional()
  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => LotteryOptionsDto)
  options: LotteryOptionsDto;
}
