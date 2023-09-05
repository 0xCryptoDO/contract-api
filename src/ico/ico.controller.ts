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

import { CreateICOContractDto, GetICOContractResDto } from './dto';

import { ICOService } from './ico.service';
import { ContractCommonService } from 'src/contract/contract.common.service';
import { ICOContract, ICOContractDocument } from './schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiTags('ICO')
@ApiBearerAuth()
@Controller('ico')
export class ICOController {
  constructor(
    private icoService: ICOService,
    private contractCommonService: ContractCommonService,
    @InjectModel(ICOContract.name)
    private ICOContractModel: Model<ICOContractDocument>,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Gets user ICO contract by Id' })
  @SetRoles(Roles.internal)
  @ApiOkResponse({ type: GetICOContractResDto })
  getICOContractById(@Param() params: GetContractDto) {
    return this.contractCommonService.getContractById(
      params.id,
      this.ICOContractModel,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Creates ICO contract' })
  @ApiCreatedResponse({ type: CreateContractResDto })
  createContract(@Body() body: CreateICOContractDto, @Request() req) {
    return this.contractCommonService.createContract(
      req.user.userId,
      body,
      this.ICOContractModel,
    );
  }
}
