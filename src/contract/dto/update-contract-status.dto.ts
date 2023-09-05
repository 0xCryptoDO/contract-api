import { ContractStatus } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateContractStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  contractId: string;

  @ApiProperty({ enum: ContractStatus })
  @IsNotEmpty()
  @IsEnum(ContractStatus)
  newStatus: string;
}
