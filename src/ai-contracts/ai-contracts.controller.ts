import { Controller, Get, UseGuards } from '@nestjs/common';
import { AiContractsService } from './ai-contracts.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetAiContractsDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '@cryptodo/common';
import { Reflector } from '@nestjs/core';

@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiTags('Ai')
@ApiBearerAuth()
@Controller('ai-contracts')
export class AiContractsController {
  constructor(private readonly aiContractsService: AiContractsService) {}

  @Get()
  @ApiOkResponse({ type: GetAiContractsDto })
  getAiContracts() {
    return this.aiContractsService.getAiContracts();
  }
}
