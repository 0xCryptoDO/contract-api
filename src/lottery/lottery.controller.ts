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

import { CreateLotteryContractDto } from './dto/create-lottery.dto';
import { GetLotteryContractResDto } from './dto/get-lottery-contract.dto';
import { GetLotteryInfoResDto } from './dto/get-lottery-info.dto';

import { LotteryService } from './lottery.service';
import { ContractCommonService } from 'src/contract/contract.common.service';
import {
  LotteryContract,
  LotteryContractDocument,
} from './schemas/lottery-contract.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@ApiTags('Lottery')
@ApiBearerAuth()
@Controller('lottery')
export class LotteryController {
  constructor(
    private lotteryService: LotteryService,
    private contractCommonSercice: ContractCommonService,
    @InjectModel(LotteryContract.name)
    private lotteryContractModel: Model<LotteryContractDocument>,
  ) {}

  @Get('/info/:id')
  @ApiOperation({ summary: 'Gets Lottery info by Id' })
  @ApiOkResponse({ type: GetLotteryInfoResDto })
  getLottery(@Param() params: GetContractDto) {
    return this.lotteryService.getLotteryById(params.id);
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/:id')
  @ApiOperation({ summary: 'Gets user Lottery contract by Id' })
  @SetRoles(Roles.internal)
  @ApiOkResponse({ type: GetLotteryContractResDto })
  getContractById(@Param() params: GetContractDto) {
    return this.contractCommonSercice.getContractById(
      params.id,
      this.lotteryContractModel,
    );
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post()
  @ApiOperation({ summary: 'Creates Lottery contract' })
  @ApiCreatedResponse({ type: CreateContractResDto })
  createContract(@Body() body: CreateLotteryContractDto, @Request() req) {
    return this.contractCommonSercice.createContract(
      req.user.userId,
      body,
      this.lotteryContractModel,
    );
  }
}
