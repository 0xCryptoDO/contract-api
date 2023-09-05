import { JwtAuthGuard, Roles, RolesGuard, SetRoles } from '@cryptodo/common';
import { ContractType } from '@cryptodo/contracts';
import {
  Body,
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DaoService } from 'src/dao/dao.service';
import { GetERC20ContractResDto } from 'src/erc20/dto';
import { ERC20Service } from 'src/erc20/erc20.service';
import { ERC721Service } from 'src/erc721/erc721.service';
import { ICOService } from 'src/ico/ico.service';
import { LotteryService } from 'src/lottery/lottery.service';
import { StakingService } from '../staking/staking.service';
import { ContractService } from './contract.service';
import {
  DeployContractDto,
  DeployContractResponseDto,
  GetContractStatsResDto,
  LandingStatsDto,
  UpdateAbiDto,
  UpdateContractStatusDto,
  UpdateSourceCodeDto,
  VerifyContractDto,
  VerifyСontractParamsDto,
} from './dto';
import { AirDropService } from 'src/airDrop/air-drop.service';
import { QuestService } from 'src/quest/quest.service';
import { MultisigService } from 'src/multisig/multisig.service';
import { ERC20DefService } from 'src/erc20/erc20Def.service';
import { VestingService } from 'src/vesting/vesting.service';

@ApiTags('Contracts')
@ApiBearerAuth()
@Controller('contracts')
export class ContractController {
  constructor(
    private contractService: ContractService,
    private erc20Service: ERC20Service,
    private erc20DefService: ERC20DefService,
    private icoService: ICOService,
    private erc721Service: ERC721Service,
    private daoService: DaoService,
    private lotteryService: LotteryService,
    private airDropService: AirDropService,
    private multisigService: MultisigService,
    private stakingService: StakingService,

    private questService: QuestService,
    private vestingService: VestingService,
  ) {}

  private services: Partial<Record<ContractType, any>> = {
    [ContractType.airDropContract]: this.airDropService,
    [ContractType.daoContract]: this.daoService,
    [ContractType.erc20Contract]: this.erc20Service,
    [ContractType.erc20DefContract]: this.erc20DefService,
    [ContractType.erc721Contract]: this.erc721Service,
    [ContractType.icoContract]: this.icoService,
    [ContractType.lotteryContract]: this.lotteryService,
    [ContractType.multisigContract]: this.multisigService,
    [ContractType.vestingContract]: this.vestingService,
    [ContractType.stakingContract]: this.stakingService,
  };

  @Get()
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @ApiOperation({ summary: 'Gets all user contracts' })
  @ApiOkResponse({ type: [GetERC20ContractResDto] })
  @ApiQuery({ name: 'type', enum: ContractType, required: false })
  getContracts(@Request() req, @Query('type') type?: ContractType) {
    return this.contractService.getContracts(req.user.userId, type);
  }

  @Get('/stats/landing')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  @ApiOperation({ summary: 'Gets stats for landing' })
  @ApiOkResponse({ type: [LandingStatsDto] })
  getLandingStats() {
    return this.contractService.getLandingStats();
  }

  @Put('/status')
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @SetRoles(Roles.internal)
  updateContractStatus(@Body() params: UpdateContractStatusDto) {
    return this.contractService.updateContractStatus(params);
  }

  @Post('/verify/:contractType')
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @ApiOperation({ summary: 'Verifies user contract' })
  @ApiNoContentResponse({ description: 'Contract was verified successfully' })
  async verifyContact(
    @Body() verifyDto: VerifyContractDto,
    @Request() req,
    @Param() params: VerifyСontractParamsDto,
  ) {
    await this.contractService.updateTestnetsInfo(
      params,
      verifyDto,
      req.user.userId,
    );
    await this.services[params.contractType].verify(verifyDto, req.user.userId);
    return;
  }

  @Post('/abi')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @ApiOperation({ summary: 'Update contract abi' })
  @ApiNoContentResponse({
    description: 'Contract abi was updated successfully',
  })
  async updateAbi(@Body() body: UpdateAbiDto) {
    return this.contractService.updateAbi(body);
  }

  @Put('/sourceCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @ApiOperation({ summary: 'Update contract abi' })
  @ApiNoContentResponse({
    description: 'Contract source code was updated successfully',
  })
  async updateSourceCode(@Body() body: UpdateSourceCodeDto) {
    return this.contractService.updateSourceCode(body);
  }

  @Get('/deployInfo')
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @ApiOperation({ summary: 'Get deploy contract info' })
  @ApiOkResponse({ type: DeployContractResponseDto })
  getDeployInfo(
    @Query() deployDto: DeployContractDto,
    @Request() req,
  ): Promise<DeployContractResponseDto> {
    return this.services[deployDto.contractType].getDeployInfo(
      deployDto,
      req.user.userId,
    );
  }

  @Get('/stats')
  @ApiOkResponse({ type: GetContractStatsResDto })
  getStats(): Promise<GetContractStatsResDto> {
    return this.contractService.getContractsStats();
  }
}
