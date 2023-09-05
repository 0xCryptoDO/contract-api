import { Network } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class RequestFundsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @ApiProperty({
    enum: Network,
  })
  @IsNotEmpty()
  @IsEnum(Network)
  network: Network;
}

export class RequestFundsResDto {
  @ApiProperty()
  isFaucetAvailable: boolean;

  @ApiProperty({ required: false })
  txHash?: string;

  @ApiProperty({ required: false })
  txInExplorerUrl?: string;
}

export class CheckFaucetAvailabilityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @ApiProperty({
    enum: Network,
  })
  @IsNotEmpty()
  @IsEnum(Network)
  network: Network;
}

export class CheckFaucetAvailabilityResDto {
  @ApiProperty()
  isAvailable: boolean;

  @ApiProperty()
  nextAvailableDate?: Date;
}
