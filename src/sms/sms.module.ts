/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SMS_Service } from './sms.service';
import { SMS_Controller } from './sms.controller'; 
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env.SMS_KEY', '.env.SMS_SENDER', '.env.SMS_USER_ID'],
  })],
  exports: [ConfigModule],
  providers: [SMS_Service],
  controllers: [SMS_Controller],
})
export class SMS_Module {}
