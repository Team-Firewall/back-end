/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  // Param,
  // Get,
  // Delete,
  // Post,
  // Put,
  // Body,
  // Param,
  // RawBodyRequest,
  Query,
  // Res,
} from '@nestjs/common';
import { RegulateService } from './regulate.service';
import { Regulate } from './../entity/regulate.entity';

@Controller('v1/regulate')
export class RegulateController {
  constructor(private readonly regulateService: RegulateService) {}

  // @Get('scoreDivision?')
  // async FindRegulate(@Query('checked') checked: number): Promise<Regulate[]> {
  //   return this.regulateService.FindRegulate(checked);
  // }
  @Get('scoreDivision?')
  async FindRegulate(@Query('checked') checked: string): Promise<Regulate[]> {
    return this.regulateService.FindRegulate(checked);
  }
}
