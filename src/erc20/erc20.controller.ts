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
import {
  CreateERC20ContractDto,
  CreateERC20DEefContractDto,
  GetERC20ContractResDto,
} from './dto';

import { ERC20Service } from './erc20.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  ERC20Contract,
  ERC20ContractDocument,
} from './schemas/erc20-contract.schema';
import { Model } from 'mongoose';
import {
  ERC20DefContract,
  ERC20DefContractDocument,
} from './schemas/erc20-def-contract.schema';
import { ContractCommonService } from 'src/contract/contract.common.service';
import { ERC20DefService } from './erc20Def.service';
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiTags('ERC20')
@ApiBearerAuth()
@Controller('erc20')
export class ERC20Controller {
  constructor(
    private erc20Service: ERC20Service,
    private erc20DefService: ERC20DefService,
    private contractCommonSercice: ContractCommonService,
    @InjectModel(ERC20Contract.name)
    private ERC20ContractModel: Model<ERC20ContractDocument>,
    @InjectModel(ERC20DefContract.name)
    private ERC20DefContractModel: Model<ERC20DefContractDocument>,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Gets user ERC20 contract by Id' })
  @SetRoles(Roles.internal)
  @ApiOkResponse({ type: GetERC20ContractResDto })
  getERC20ContractById(@Param() params: GetContractDto) {
    return this.contractCommonSercice.getContractById(
      params.id,
      this.ERC20ContractModel,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Creates ERC20 contract' })
  @ApiCreatedResponse({ type: CreateContractResDto })
  createContract(@Body() body: CreateERC20ContractDto, @Request() req) {
    return this.contractCommonSercice.createContract(
      req.user.userId,
      body,
      this.ERC20ContractModel,
    );
  }

  @Get('def/:id')
  @ApiOperation({ summary: 'Gets user ERC20 deflationary contract by Id' })
  @SetRoles(Roles.internal)
  @ApiOkResponse({ type: GetERC20ContractResDto })
  getERC20DefContractById(@Param() params: GetContractDto) {
    return this.contractCommonSercice.getContractById(
      params.id,
      this.ERC20DefContractModel,
    );
  }

  @Post('/def')
  @ApiOperation({ summary: 'Creates deflationary ERC20 contract' })
  @ApiCreatedResponse({ type: CreateContractResDto })
  createDefContract(@Body() body: CreateERC20DEefContractDto, @Request() req) {
    return this.contractCommonSercice.createContract(
      req.user.userId,
      body,
      this.ERC20DefContractModel,
    );
  }
}
