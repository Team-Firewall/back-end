/* eslint-disable prettier/prettier */
import {
  Controller, Delete,
  Get, Post,
  // Param,
  // Get,
  // Delete,
  // Post,
  // Put,
  // Body,
  // Param,
  // RawBodyRequest,
  Query, Req, Res
  // Res,
} from "@nestjs/common";
import { RegulateService } from './regulate.service';
import { Regulate } from './../entity/regulate.entity';

@Controller('v1/regulate')
export class RegulateController {
  constructor(private readonly regulateService: RegulateService) {}

  @Get('scoreDivision?')
  async FindRegulate(@Query('checked') checked: string): Promise<Regulate[]> {
    return this.regulateService.FindRegulate(checked);
  }

  @Get()
  async RegulateList() {
    return this.regulateService.RegulateList();
  }

  @Post()
  async RegulateCreate(@Req() req, @Res() res) {
    return this.regulateService.RegulateCreate(req, res);
  }

  @Post('update')
  async RegulateUpdate(@Req() req, @Res() res) {
    return this.regulateService.RegulateUpdate(req, res);
  }

  @Delete('delete')
  async RegulateDelete(@Req() req, @Res() res) {
    return this.regulateService.RegulateDelete(req, res);
  }
}
