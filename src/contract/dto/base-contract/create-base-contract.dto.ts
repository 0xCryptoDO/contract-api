import { Network, INewContractBase } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBaseContractDto implements INewContractBase {
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
