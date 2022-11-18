/* eslint-disable prettier/prettier */
import { Controller, Req, Res, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Request, Response} from 'express';
import { User } from '../entity/user.entity';
@Controller()
export class AdminController {
  constructor(private readonly AdminService: AdminService) {}

  @Post('changePassword')
  async changePassword(@Req() req: Request, @Res() res: Response ) {
    const {prepw, nextpw} = req.body;
    return await this.AdminService.changePassword(req, res, prepw, nextpw);
  }

  @Post("addUser")
  async addUser(@Req() req: Request, @Res() res: Response) {
    const { name, grade, classNum, number, phone, account, password, role } = req.body
    return await this.AdminService.addUser(req, name, grade, classNum, number,  phone, account, password, role, res);
  }

  @Post('addUserMany')
  async addUserMany(@Req() req: Request, @Res() res: Response) {
    return await this.AdminService.addUserMany(req, res);
  }
  
  @Post('deleteUser')
  async deleteUser(@Req() req: Request, @Res() res: Response) {
    return await this.AdminService.deleteUser(res, req);
  }
}