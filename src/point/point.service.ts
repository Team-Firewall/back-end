/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from '../entity/point.entity';
import { Request, Response } from 'express';

@Injectable()
export class PointService {
  remove: any;
  create: any;
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  // 발급된 상벌점 데이터 출력
  findAll(): Promise<Point[]> {
    return this.pointRepository.find();
  }

  // id 값으로 상벌점 데이터 조회
  findOne(id: number): Promise<Point> {
    return this.pointRepository.findOne({ where: { id } });
  }

  // userId 값으로 상벌점 데이터 조회
  async fetchPointByUserId(userId: number): Promise<Point[]> {
    return this.pointRepository.findBy({ userId });
  }

  // id로 선택한 상벌점 데이터 조회 (데이터정보, 사용자정보, 규정정보)
  async fetchPointByUserIdAndRegulateId(id: number): Promise<Point | null> {
    return this.pointRepository.findOne({
      where: { id: Number(id) },
      relations: ['user', 'regulate'],
    });
  }

  // 삭제
  async deleteById(id: number, res: Response) {
    const isId = this.findOne(id);
    if(isId){
      await this.pointRepository
        .createQueryBuilder()
        .delete()
        .from(Point)
        .where("id = :id", {id})
        .execute()
      res.status(200).send({
        success: true,
        msg: '성공적으로 상벌점 내역을 삭제 했습니다.'
      })
    }else{
      res.status(400).send({
        success: false,
        msg: '해당하는 상벌점 내역을 조회할 수 없습니다.'
      })
    }
  }
  // 추가
  async addPoint(req: Request, res: Response) {
    const { userId, regulateId, reason, token } = req.body;
    const base64payload = token.split('.')[1];
    const payload = Buffer.from(base64payload, 'base64');
    const result = JSON.parse(payload.toString());
    const issure = result.name;
    
    const data = await this.pointRepository.insert({
      userId,
      regulateId,
      reason,
      issure
    });
    if(data) {
        res.status(200).send({
        success: true,
        msg: '성공적으로 상벌점을 부여하였습니다.',
      })
    } else {
      res.status(400).send({
        success: false,
        msg: '유저가 존재하지 않거나 잘못된 규정입니다.'
      })
    }
  }

  // 수정
  async update(id: number, point: Point): Promise<void> {
    const existedUser = await this.findOne(id);
    if (existedUser) {
      await this.pointRepository
        .createQueryBuilder()
        .update(Point)
        .set({
          reason: point.reason,
          // point: point.point,/
        })
        .where('id = :id', { id })
        .execute();
    }
  }
}
