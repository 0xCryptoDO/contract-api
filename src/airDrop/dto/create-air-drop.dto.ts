import {
  IAirDropNewContract,
  AirDropType,
  IAirDropOptions,
} from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateBaseContractDto } from 'src/contract/dto/base-contract/create-base-contract.dto';

class AirDropOptionsDto implements IAirDropOptions {
  @ApiProperty()
  @IsOptional()
  @IsString()
  aiFunction?: string;
}

export class CreateAirDropContractDto
  extends CreateBaseContractDto
  implements IAirDropNewContract
{
  @IsEnum(AirDropType)
  @IsNotEmpty()
  @ApiProperty({ enum: AirDropType })
  airDropType: AirDropType;

  @IsOptional()
  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => AirDropOptionsDto)
  options: AirDropOptionsDto;
}
