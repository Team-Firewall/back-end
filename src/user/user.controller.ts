/* eslint-disable prettier/prettier */
import {
  Controller,
  // Get,
  // Delete,
  Post,
  // Put,
  // Body,
  // Param,
  // RawBodyRequest,
  Req,
  // Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './../entity/user.entity';
import { Request } from 'express';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('student')
  FindByGrade(@Req() req: Request): Promise<User> {
    const { grade, classNum, number } = req.body;
    return this.userService.FindByGrade(grade, classNum, number);
  }


}