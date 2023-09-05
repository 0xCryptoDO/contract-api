import { IStakingOptions } from '@cryptodo/contracts/lib/types/staking/staking-contract.types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEthereumAddress,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateBaseContractDto } from 'src/contract/dto/base-contract/create-base-contract.dto';

class StakingOptionsDto implements IStakingOptions {
  @ApiProperty()
  @IsOptional()
  @IsString()
  aiFunction?: string;
}

export class CreateStakingContractDto extends CreateBaseContractDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  @ApiProperty()
  token: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @ApiProperty({ type: Number, isArray: true })
  lockPeriods: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @ApiProperty({ type: Number, isArray: true })
  rewardRates: number[];

  @IsBoolean()
  @ApiProperty({ type: Boolean })
  isEarlyWithdrawal: boolean;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  minStake: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  maxStake: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => StakingOptionsDto)
  options: StakingOptionsDto;
}
