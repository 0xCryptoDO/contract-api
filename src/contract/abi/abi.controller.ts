import { Roles, SetRoles } from '@cryptodo/common';
import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { GetAbiWriteFunctionsDto } from './dto';
import { IAbiElement } from './types';
import { AbiService } from './abi.service';

@ApiTags('Abi')
@ApiBearerAuth()
@Controller('abi')
export class AbiController {
  constructor(private abiService: AbiService) {}

  @Get('/write-functions/:address')
  @ApiOperation({ summary: 'Gets write functions from contract' })
  @SetRoles(Roles.regular)
  @ApiOkResponse({ type: Array<IAbiElement> })
  getContractWriteFunctions(
    @Query() params: GetAbiWriteFunctionsDto,
    @Param('address') address: string,
  ) {
    return this.abiService.getContractWriteFunctions(address, params);
  }
}
