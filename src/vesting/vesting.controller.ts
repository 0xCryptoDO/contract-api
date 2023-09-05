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

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ContractCommonService } from 'src/contract/contract.common.service';
import { VestingContract, VestingContractDocument } from './schemas';
import { GetVestingContractResDto, CreateVestingContractDto } from './dto';

@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiTags('Vesting')
@ApiBearerAuth()
@Controller('vesting')
export class VestingController {
  constructor(
    private contractCommonSercice: ContractCommonService,
    @InjectModel(VestingContract.name)
    private vestingContractModel: Model<VestingContractDocument>,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Gets user contract by Id' })
  @SetRoles(Roles.internal)
  @ApiOkResponse({ type: GetVestingContractResDto })
  getERC20ContractById(@Param() params: GetContractDto) {
    return this.contractCommonSercice.getContractById(
      params.id,
      this.vestingContractModel,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Creates vesting contract' })
  @ApiCreatedResponse({ type: CreateContractResDto })
  createContract(@Body() body: CreateVestingContractDto, @Request() req) {
    return this.contractCommonSercice.createContract(
      req.user.userId,
      body,
      this.vestingContractModel,
    );
  }
}
