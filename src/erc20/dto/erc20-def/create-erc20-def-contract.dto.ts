import {
  IERC20DefNewContract,
  IERC20DefOptions,
  Network,
} from '@cryptodo/contracts';
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
  IsPositive,
  IsString,
  IsUppercase,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  MintParamsDTO,
  TaxBurnParamsDTO,
} from '../erc20/create-erc20-contract.dto';

export class LiquidityParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  router: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  liquidityFee: number;
}

export class TeamParamsDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  teamFee: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  teamWallet: string;
}

export class ERC20DefContractOptionsDto implements IERC20DefOptions {
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
  @ValidateNested()
  @Type(() => TaxBurnParamsDTO)
  taxBurn?: TaxBurnParamsDTO;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => TeamParamsDTO)
  team?: TeamParamsDTO;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => LiquidityParamsDto)
  liquidity?: LiquidityParamsDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  aiFunction?: string;
}

export class CreateERC20DEefContractDto implements IERC20DefNewContract {
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
  @Type(() => ERC20DefContractOptionsDto)
  options: ERC20DefContractOptionsDto;

  @IsString()
  @MinLength(1)
  @MaxLength(25)
  @IsNotEmpty()
  @Matches(/^(?![0-9])/, {
    message: 'Contract name must not start with a number',
  })
  @ApiProperty()
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
