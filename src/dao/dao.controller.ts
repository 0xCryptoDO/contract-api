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
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateContractResDto } from 'src/contract/dto/create-contract-res.dto';
import { GetContractDto } from 'src/contract/dto/get-contract.dto';
import { CreateDaoContractDto } from './dto/create-dao-contract.dto';
import { DaoService } from './dao.service';
import { GetDaoContractResDto } from './dto/get-dao-contract.dto';
import { VoteDaoProposalDto } from './dto/vote-dao-proposal.dto';
import { GetProposalStatusDto } from './dto/get-proposal-status.dto';
import { VerifyContractDto } from 'src/contract/dto/verify-contract.dto';
import { ContractCommonService } from 'src/contract/contract.common.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  DaoContract,
  DaoContractDocument,
} from './schemas/dao-contract.schema';
import { Model } from 'mongoose';

@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiTags('DAO')
@ApiBearerAuth()
@Controller('dao')
export class DaoController {
  constructor(
    private daoService: DaoService,
    private contractCommonSercice: ContractCommonService,
    @InjectModel(DaoContract.name)
    private daoContractModel: Model<DaoContractDocument>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Gets all user dao' })
  @ApiOkResponse({ type: [GetDaoContractResDto] })
  getDaos(@Request() req) {
    return this.daoService.getDaos(req.user.userId);
  }

  @Post('/verify/dao')
  @ApiOperation({ summary: 'Verifies user dao' })
  @ApiNoContentResponse({ description: 'Dao was verified successfully' })
  verifyContact(@Body() verifyDto: VerifyContractDto, @Request() req) {
    return this.daoService.verify(verifyDto, req.user.userId);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Gets user dao contract by Id' })
  @SetRoles(Roles.internal)
  @ApiOkResponse({ type: GetDaoContractResDto })
  getContractById(@Param() params: GetContractDto) {
    return this.contractCommonSercice.getContractById(
      params.id,
      this.daoContractModel,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Creates dao contract' })
  @ApiCreatedResponse({ type: CreateContractResDto })
  createContract(@Body() body: CreateDaoContractDto, @Request() req) {
    return this.contractCommonSercice.createContract(
      req.user.userId,
      body,
      this.daoContractModel,
    );
  }

  @Post('/vote')
  @ApiOperation({ summary: 'Vote for dao contract proposal' })
  proposalVote(@Body() body: VoteDaoProposalDto, @Request() req) {
    return this.daoService.proposalVote(
      req.proposalId,
      req.contractAddress,
      req.sign,
      req.network,
    );
  }

  @Get('/:network/:address/:id')
  @ApiOperation({ summary: 'Gets status of proposal voting' })
  getProposalStatus(@Param() params: GetProposalStatusDto) {
    return this.daoService.getProposalStatus(
      params.id,
      params.address,
      params.network,
    );
  }
}
