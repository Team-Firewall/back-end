/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Req,
  // Res,
} from '@nestjs/common';
import { Request } from 'express';
import { SMS_Service } from './sms.service';

@Controller('v1/sms')
export class SMS_Controller {
  constructor(private readonly sms_service: SMS_Service) {}

  @Post('sendSMS')
  async sendSMS(@Req() req: Request) {
    const { phone, message } = req.body;
    return await this.sms_service.sendMessage(phone, message);
  }
}