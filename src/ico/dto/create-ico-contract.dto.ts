import { Network, IICONewContract, IIcoOptions } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class IcoOptionsDto implements IIcoOptions {
  @ApiProperty()
  @IsOptional()
  @IsString()
  aiFunction?: string;
}

export class CreateICOContractDto implements IICONewContract {
  @IsEthereumAddress()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  token: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty()
  price: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lockup: number;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty()
  maxPerWallet: string;

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

  @IsEthereumAddress()
  @IsNotEmpty()
  @ApiProperty()
  receiverAddress: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  @ApiProperty()
  owner: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => IcoOptionsDto)
  options: IcoOptionsDto;
}
