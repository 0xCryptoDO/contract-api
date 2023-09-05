import { JwtAuthGuard, Roles, RolesGuard, SetRoles } from '@cryptodo/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateContractResDto } from 'src/contract/dto/create-contract-res.dto';

import { GetContractDto } from 'src/contract/dto/get-contract.dto';

import { CreateAirDropContractDto } from './dto/create-air-drop.dto';
import { GetAirDropContractResDto } from './dto/get-air-drop-contract.dto';

import { AirDropService } from './air-drop.service';
import { ContractCommonService } from 'src/contract/contract.common.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AirDropContract,
  AirDropContractDocument,
} from './schemas/air-drop-contract.schema';

@ApiTags('AirDrop')
@ApiBearerAuth()
@Controller('airDrop')
export class AirDropController {
  constructor(
    private airDropService: AirDropService,
    private contractCommonSercice: ContractCommonService,
    @InjectModel(AirDropContract.name)
    private airDropContractModel: Model<AirDropContractDocument>,
  ) {}

  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/:id')
  @ApiOperation({ summary: 'Gets user AirDrop by Id' })
  @SetRoles(Roles.internal)
  @ApiOkResponse({ type: GetAirDropContractResDto })
  getContractById(@Param() params: GetContractDto) {
    return this.contractCommonSercice.getContractById(
      params.id,
      this.airDropContractModel,
    );
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post()
  @ApiOperation({ summary: 'Creates AirDrop contract' })
  @ApiCreatedResponse({ type: CreateContractResDto })
  createContract(@Body() body: CreateAirDropContractDto, @Request() req) {
    return this.contractCommonSercice.createContract(
      req.user.userId,
      body,
      this.airDropContractModel,
    );
  }
}
