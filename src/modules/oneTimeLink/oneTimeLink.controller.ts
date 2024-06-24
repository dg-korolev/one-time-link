import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OneTimeLinkService } from './oneTimeLink.service';
import { OneTimeLinkDto } from './oneTimeLink.types';
import { CreateOneTimeLinkRequestDto } from './dto/request';

@Controller('one-time-link')
@UsePipes(new ValidationPipe({ transform: true }))
export class OneTimeLinkController {
  constructor(private readonly oneTimeLinkService: OneTimeLinkService) {}

  @Post('create')
  async create(
    @Body() data: CreateOneTimeLinkRequestDto,
  ): Promise<OneTimeLinkDto> {
    return await this.oneTimeLinkService.createLink(data.value);
  }

  @Get('resolve/:id')
  async resolve(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.oneTimeLinkService.resolveLink(id);
  }
}
