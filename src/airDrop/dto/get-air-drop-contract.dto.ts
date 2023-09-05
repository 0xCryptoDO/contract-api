import { AirDropType, IAirDropContract } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { GetBaseContractResDto } from 'src/contract/dto/base-contract/get-base-contract.dto';

export class GetAirDropContractResDto
  extends GetBaseContractResDto
  implements IAirDropContract
{
  @ApiProperty({ enum: AirDropType })
  airDropType: AirDropType;
}
