import { Network } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export class GetAbiWriteFunctionsDto {
  @IsEnum(Network)
  @IsNotEmpty()
  @ApiProperty({ enum: Network })
  network: Network;

  @IsBoolean()
  @IsNotEmpty()
  @Transform((obj) => {
    return [true, 'enabled', 'true'].includes(obj.value);
  })
  @ApiProperty({ type: Boolean })
  testnet: boolean;
}
