/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  // Delete,
  Post,
  // Put,
  // Body,
  // Param,
  // RawBodyRequest,
  Req, Res
  // Res,
} from "@nestjs/common";
import { UserService } from './user.service';
import { User } from './../entity/user.entity';
import { Request, Response } from "express";

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('student')
  FindUser(@Req() req: Request): Promise<User[]> {
    const { permission, grade, classNum, number, name } = req.body;
    return this.userService.FindUser( permission, grade, classNum, number, name );
  }

  @Get()
  UserList() {
    return this.userService.UserList();
  }

  @Post('total')
  FindTotal(@Req() req: Request, @Res() res: Response) {
    return this.userService.FindTotal(req, res);
  }

}
