/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { Client as AligoClient } from 'aligo-smartsms'
import 'dotenv/config'

@Injectable()
export class SMS_Service {
  private client: AligoClient

  constructor(configService: ConfigService) {
    this.client = new AligoClient({
      key: configService.get<string>('KEY', process.env.SMS_KEY),
      sender: configService.get<string>('USER_ID', process.env.SMS_SENDER),
      user_id: configService.get<string>('SENDER', process.env.SMS_USER_ID),
    });
  }
  
  async sendMessage(phone, message) {
    try {
      return await this.client.bulkSendMessages({
        cnt: 1,
        msg: [{
          receiver: phone,
          content: message,
        }],
        msg_type: 'SMS'
      })
    } catch (err) {
      console.log(err);
    }
  }
}