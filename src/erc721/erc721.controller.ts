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
import { GetERC20ContractResDto } from 'src/erc20/dto/index';
import { CreateERC721ContractDto } from './dto/create-erc721-contract.dto';
import { ERC721Service } from './erc721.service';
import { ContractCommonService } from 'src/contract/contract.common.service';
import {
  ERC721Contract,
  ERC721ContractDocument,
} from './schemas/erc721-contract.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiTags('ERC721')
@ApiBearerAuth()
@Controller('erc721')
export class ERC721Controller {
  constructor(
    private erc721Service: ERC721Service,
    private contractCommonSercice: ContractCommonService,
    @InjectModel(ERC721Contract.name)
    private ERC721ContractModel: Model<ERC721ContractDocument>,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Gets user ERC721 contract by Id' })
  @SetRoles(Roles.internal)
  @ApiOkResponse({ type: GetERC20ContractResDto })
  getContractById(@Param() params: GetContractDto) {
    return this.contractCommonSercice.getContractById(
      params.id,
      this.ERC721ContractModel,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Creates ERC721 contract' })
  @ApiCreatedResponse({ type: CreateContractResDto })
  createContract(@Body() body: CreateERC721ContractDto, @Request() req) {
    return this.contractCommonSercice.createContract(
      req.user.userId,
      body,
      this.ERC721ContractModel,
    );
  }
}
