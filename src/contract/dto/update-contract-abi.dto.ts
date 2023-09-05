import { ContractType } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class UpdateAbiDto {
  @IsMongoId()
  @ApiProperty()
  contractId: string;

  @ApiProperty({ enum: ContractType })
  contractType: ContractType;

  @ApiProperty()
  abi: string;
}
