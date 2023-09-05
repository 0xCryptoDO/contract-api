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

import { MultisigService } from './multisig.service';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ContractCommonService } from 'src/contract/contract.common.service';
import {
  MultisigContract,
  MultisigContractDocument,
} from './schemas/multisig.schema';
import { GetMultisigContractResDto } from './dto/multisig/get-multisig-contract.dto';
import { CreateMultisigContractDto } from './dto/multisig/multisig-contract.dto';
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiTags('Multisig')
@ApiBearerAuth()
@Controller('multisig')
export class MultisigController {
  constructor(
    private multisigService: MultisigService,
    private contractCommonSercice: ContractCommonService,
    @InjectModel(MultisigContract.name)
    private multisigContractModel: Model<MultisigContractDocument>,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Gets user contract by Id' })
  @SetRoles(Roles.internal)
  @ApiOkResponse({ type: GetMultisigContractResDto })
  getERC20ContractById(@Param() params: GetContractDto) {
    return this.contractCommonSercice.getContractById(
      params.id,
      this.multisigContractModel,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Creates multisig contract' })
  @ApiCreatedResponse({ type: CreateContractResDto })
  createContract(@Body() body: CreateMultisigContractDto, @Request() req) {
    return this.multisigService.create(body, req.user.userId);
  }
}
