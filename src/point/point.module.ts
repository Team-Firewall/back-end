import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { PointService } from './point.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from '../entity/point.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Point, User])],
  exports: [TypeOrmModule],
  providers: [PointService],
  controllers: [PointController],
})
export class PointModule {}
