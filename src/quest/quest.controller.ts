import { JwtAuthGuard, Roles, RolesGuard, SetRoles } from '@cryptodo/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { QuestService } from './quest.service';
import {
  GetUserQuestResDto,
  IUserQuestDto,
  UserQuestProgressDto,
} from './dto/user-quest.dto';

@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiTags('Quest')
@ApiBearerAuth()
@Controller('quest')
export class QuestController {
  constructor(private questService: QuestService) {}

  @Get('/leadboard')
  @ApiOperation({ summary: 'Returns leadboard' })
  @SetRoles(Roles.regular)
  @ApiQuery({ type: Number, name: 'offset', required: true })
  @ApiQuery({ type: Number, name: 'limit', required: true })
  @ApiOkResponse({ type: Array<IUserQuestDto> })
  getLeadBoard(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.questService.getLeadBoard({ limit, offset });
  }

  @Get('/info')
  @ApiOperation({ summary: 'Gets total quest info' })
  @SetRoles(Roles.regular)
  @ApiOkResponse({ type: UserQuestProgressDto })
  getTotalQuestInfo() {
    return this.questService.getTotalQuestInfo();
  }

  @Get('/')
  @ApiOperation({ summary: 'Gets user quest progress' })
  @SetRoles(Roles.regular)
  @ApiOkResponse({ type: GetUserQuestResDto })
  getUserQuestInfo(@Request() req) {
    return this.questService.getUserQuestInfo(req.user.userId);
  }

  @Post('/socialPoints/:userId')
  @ApiOperation({ summary: 'Sets user social points' })
  @SetRoles(Roles.internal)
  setSocialPoints(@Param('userId') userId: string) {
    return this.questService.setSocialPoints(userId);
  }

  @Post('/tweetLink')
  @ApiOperation({ summary: 'Sets user social points for tweet link' })
  @SetRoles(Roles.regular)
  setTweetPoints(@Request() req, @Body() { tweetLink }: { tweetLink: string }) {
    return this.questService.setTweetPoints(tweetLink, req.user.userId);
  }

  @Post('/recalulate')
  @SetRoles(Roles.internal)
  recalculate() {
    return this.questService.recalculateAllQuests();
  }
}
