/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/User.entity';
import { SignController } from './sign.controller';
import { SignService } from './sign.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  controllers: [SignController],
  providers: [SignService],
})
export class SignModule {}
