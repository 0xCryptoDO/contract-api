import { IERC721NewContract, IERC721Options } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUppercase,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateBaseContractDto } from 'src/contract/dto/base-contract/create-base-contract.dto';

export class ERC721ContractOptionsDto implements IERC721Options {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  incrementTokenMaxAmount?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  presale?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  aiFunction?: string;
}

export class CreateERC721ContractDto
  extends CreateBaseContractDto
  implements IERC721NewContract
{
  @IsEthereumAddress()
  @IsNotEmpty()
  @ApiProperty()
  owner: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  totalSupply: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  tokenPerTx: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  tokenPerWallet: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  timeForReveal: number;

  @IsEthereumAddress()
  @IsNotEmpty()
  @ApiProperty()
  founder: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?![0-9])/, {
    message: 'Contract name must not start with a number',
  })
  @ApiProperty()
  contractName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(5)
  @IsUppercase()
  @IsNotEmpty()
  @ApiProperty()
  symbol: string;

  @IsNotEmpty()
  @ApiProperty()
  uri: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => ERC721ContractOptionsDto)
  options?: ERC721ContractOptionsDto;
}
