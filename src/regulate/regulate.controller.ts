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

<<<<<<< HEAD
  // @Get('scoreDivision?')
  // async FindRegulate(@Query('checked') checked: number): Promise<Regulate[]> {
  //   return this.regulateService.FindRegulate(checked);
  // }
}
=======
  @Get('scoreDivision?')
  async FindRegulate(@Query('checked') checked: string): Promise<Regulate[]> {
    return this.regulateService.FindRegulate(checked);
  }
}
>>>>>>> 3f49fa3cdd89c0b996bf8cf60269f6b7117c4540
