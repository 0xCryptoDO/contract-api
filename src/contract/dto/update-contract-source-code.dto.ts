import { ContractType } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class UpdateSourceCodeDto {
  @IsMongoId()
  @ApiProperty()
  contractId: string;

  @IsString()
  @ApiProperty({ enum: ContractType })
  contractType: ContractType;

  @IsString()
  @ApiProperty()
  sourceCode: string;
}
