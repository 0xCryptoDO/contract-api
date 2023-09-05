import { IContractBase } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { GetBaseContractResDto } from './base-contract';

export class GetContractDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class GetContractResDto
  extends GetBaseContractResDto
  implements IContractBase {}
