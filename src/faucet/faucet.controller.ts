import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CheckFaucetAvailabilityDto,
  CheckFaucetAvailabilityResDto,
  RequestFundsDto,
  RequestFundsResDto,
} from './dto';
import { FaucetService } from './faucet.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '@cryptodo/common';
import { Reflector } from '@nestjs/core';

@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiTags('Faucet')
@ApiBearerAuth()
@Controller('faucet')
export class FaucetController {
  constructor(private faucetService: FaucetService) {}

  @Post('request')
  @ApiOperation({ summary: 'Sends funds to provided address' })
  @ApiOkResponse({ type: RequestFundsResDto })
  @HttpCode(HttpStatus.OK)
  requestFunds(
    @Body() requestFundsDto: RequestFundsDto,
  ): Promise<RequestFundsResDto> {
    return this.faucetService.requestFunds(requestFundsDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Check if faucet is available for user' })
  @ApiOkResponse({ type: CheckFaucetAvailabilityResDto })
  @HttpCode(HttpStatus.OK)
  checkFaucetAvailability(
    @Query() checkFaucetAvailabilityDto: CheckFaucetAvailabilityDto,
  ): Promise<CheckFaucetAvailabilityResDto> {
    return this.faucetService.checkFaucetAvailability(
      checkFaucetAvailabilityDto,
    );
  }
}
