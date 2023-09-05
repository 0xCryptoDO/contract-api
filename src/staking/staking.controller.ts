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
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard, Roles, RolesGuard, SetRoles } from '@cryptodo/common';

import { CreateContractResDto } from 'src/contract/dto/create-contract-res.dto';
import { GetContractDto } from 'src/contract/dto/get-contract.dto';
import { ContractCommonService } from 'src/contract/contract.common.service';

import { StakingContract, StakingContractDocument } from './schemas';
import { GetStakingContractResDto, CreateStakingContractDto } from './dto';

@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiTags('Staking')
@ApiBearerAuth()
@Controller('staking')
export class StakingController {
  constructor(
    private contractCommonService: ContractCommonService,
    @InjectModel(StakingContract.name)
    private stakingContractModel: Model<StakingContractDocument>,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Gets user contract by Id' })
  @SetRoles(Roles.internal)
  @ApiOkResponse({ type: GetStakingContractResDto })
  getERC20ContractById(@Param() params: GetContractDto) {
    return this.contractCommonService.getContractById(
      params.id,
      this.stakingContractModel,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Creates vesting contract' })
  @ApiCreatedResponse({ type: CreateContractResDto })
  createContract(@Body() body: CreateStakingContractDto, @Request() req) {
    return this.contractCommonService.createContract(
      req.user.userId,
      body,
      this.stakingContractModel,
    );
  }
}
