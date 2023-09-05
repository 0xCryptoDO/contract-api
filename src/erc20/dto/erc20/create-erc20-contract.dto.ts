import { IERC20Options, IERC20NewContract, Network } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsEthereumAddress,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUppercase,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class MintParamsDTO {
  @ApiProperty()
  @IsInt()
  @Min(1)
  cap: number;
}

export class TaxBurnParamsDTO {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(100)
  burnFee: number;
}

export class ERC20ContractOptionsDto implements IERC20Options {
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => MintParamsDTO)
  mint?: MintParamsDTO;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  burn?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  blacklist?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  pause?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  aiFunction?: string;
}

export class CreateERC20ContractDto implements IERC20NewContract {
  @IsEthereumAddress()
  @IsNotEmpty()
  @ApiProperty()
  initialOwner: string;

  @IsString()
  @MinLength(3)
  @MaxLength(5)
  @IsUppercase()
  @IsNotEmpty()
  @ApiProperty()
  symbol: string;

  @IsInt()
  @Min(1)
  @Max(18)
  @IsNotEmpty()
  @ApiProperty()
  decimals: number;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  totalSupply: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => ERC20ContractOptionsDto)
  options: ERC20ContractOptionsDto;

  @IsString()
  @MinLength(1)
  @MaxLength(25)
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^(?![0-9])/, {
    message: 'Contract name must not start with a number',
  })
  name: string;

  @IsEnum(Network)
  @IsNotEmpty()
  @ApiProperty({ enum: Network })
  network: Network;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  testnet: boolean;
}
