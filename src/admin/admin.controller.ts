/* eslint-disable prettier/prettier */
import { Controller, Req, Res, Post, Put } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Request, Response} from 'express';
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('changePassword')
  async changePassword(@Req() req: Request, @Res() res: Response ) {
    const {prepw, nextpw} = req.body;
    return await this.adminService.changePassword(req, res, prepw, nextpw);
  }

  @Post("addUser")
  async addUser(@Req() req: Request, @Res() res: Response) {
    const { name, grade, classNum, number, phone, account, password, role } = req.body
    return await this.adminService.addUser(req, name, grade, classNum, number,  phone, account, password, role, res);
  }

  @Post('addUserMany')
  async addUserMany(@Req() req: Request, @Res() res: Response) {
    return await this.adminService.addUserMany(req, res);
  }
  
  @Post('deleteUser')
  async deleteUser(@Req() req: Request, @Res() res: Response) {
    return await this.adminService.deleteUser(res, req);
  }

  @Put('editUser')
  async editUser(@Req() req: Request, @Res() res: Response) {
    return this.adminService.editUser(req, res);
  }
}