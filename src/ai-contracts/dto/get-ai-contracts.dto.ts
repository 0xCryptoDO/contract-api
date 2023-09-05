import { ApiProperty } from '@nestjs/swagger';
import { AiContract } from '../schemas';
import { IAiContractFunction } from '../types';

export class AiContractFunctionDto implements IAiContractFunction {
  @ApiProperty()
  title: string;

  @ApiProperty()
  prompt: string;

  @ApiProperty()
  description: string;
}

export class GetAiContractsDto implements AiContract {
  @ApiProperty()
  type: string;

  @ApiProperty()
  basePrompt: string;

  @ApiProperty({ type: [AiContractFunctionDto] })
  functions: IAiContractFunction[];

  @ApiProperty()
  description: string;
}
