/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { Client as AligoClient } from 'aligo-smartsms'
import 'dotenv/config'

@Injectable()
export class SMS_Service {
  public client: AligoClient
  static sendSMS: any;

  constructor() {
    this.client = new AligoClient({
      key: (process.env.SMS_KEY),
      sender: (process.env.SMS_SENDER),
      user_id: (process.env.SMS_USER_ID),
    });
  }
  
  public async sendMessage(phone ,message) {
    try {
        return await this.client.bulkSendMessages({
        cnt: 1,
        msg: [{
          receiver: phone,
          content: message,
        }],
        msg_type: 'LMS'
      })
    } catch (err) {
      console.log(err);
    }
  }
}
