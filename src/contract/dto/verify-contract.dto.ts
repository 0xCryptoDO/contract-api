import { ContractType } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class VerifyContractDto {
  @IsMongoId()
  @ApiProperty()
  contractId: string;

  @IsString()
  @ApiProperty()
  hash: string;
}

export class VerifyСontractParamsDto {
  @IsEnum(ContractType)
  @IsNotEmpty()
  @ApiProperty({ enum: ContractType })
  contractType: ContractType;
}
