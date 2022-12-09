/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Delete,
  Post,
  Put,
  // Body,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { PointService } from './point.service';
import { Point } from '../entity/point.entity';
import { Request, Response } from 'express';

@Controller('v1/point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get()
  findAll(){
    return this.pointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Point> {
    return this.pointService.findOne(id);
  }

  @Get('Relate/:id')
  fetchPointByUserIdAndRegulateId(
    @Param('id') id: number,
  ): Promise<Point | null> {
    return this.pointService.FindRelate(id);
  }

  @Get('User/:userId')
  fetchPointByUserId(@Param('userId') userId: number): Promise<Point[]> {
    return this.pointService.FindUserId(userId);
  }

  @Delete(':id')
  deleteById(@Param('id') id: number, @Res() res: Response) {
    return this.pointService.deleteById(id, res);
  }

  @Post()
  addPoint(@Req() req: Request, @Res() res: Response) {
    return this.pointService.addPoint(req, res);
  }

  @Put()
  update(@Req() req: Request, @Res() res: Response) {
    return this.pointService.update(req, res);
  }

  @Post('date')
  FindByDate(@Req() req: Request, @Res() res: Response) {
    return this.pointService.FindByDate(req, res);
  }
}

//TODO User의 상벌점을 확인할때 동일한 userId값을 가진 데이터를 불러와서 합산하여 보여줘야 함 (날짜는 createdAt으로 구분)
//TODO Regulate 테이블에서 리스트를 불러와서 규정을 선택하도록 만들어야 함 > 선택한후 해당 id를 넘겨줘야 함 regulateId로 넘겨줌
//TODO User에게 상벌점을 부여할때 Regulate 테이블의 id값(regulateId)에 해당하는 score, checked를 가져와서 각각 point, checked에 넣어줘야 함 (값을 끌어다 쓴다는 의미)
//TODO Point 테이블의 point, checked와 Regulate 테이블의 score, checked가 서로 동일하지만 Point 테이블에 새로 저장합으로써 수정과 저장에 용이
