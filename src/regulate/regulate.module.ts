/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RegulateController } from './regulate.controller';
import { RegulateService } from './regulate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Regulate } from './../entity/regulate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Regulate])],
exports: [TypeOrmModule],
  providers: [RegulateService],
  controllers: [RegulateController],
})
export class RegulateModule {}
