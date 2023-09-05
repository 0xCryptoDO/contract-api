import { CombinedContractOptions, ContractType } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';

export class DeployContractDto {
  @IsMongoId()
  @ApiProperty()
  contractId: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform((obj) => {
    return [true, 'enabled', 'true'].includes(obj.value);
  })
  @ApiProperty({ type: Boolean })
  testnet: boolean;

  @ApiProperty({ enum: ContractType })
  contractType: ContractType;
}

export class DeployContractResponseDto {
  @ApiProperty()
  sourceCode: string;

  @ApiProperty()
  constructorArgs: any;

  @ApiProperty()
  contractName: string;

  @ApiProperty()
  compilerVersion: string;

  @ApiProperty()
  options: CombinedContractOptions;

  @ApiProperty()
  aiSourceCode?: string;
}
