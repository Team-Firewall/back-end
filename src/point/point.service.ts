import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from '../entity/point.entity';

@Injectable()
export class PointService {
  remove: any;
  create: any;
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  // 전체 조회
  findAll(): Promise<Point[]> {
    return this.pointRepository.find();
  }

  // 단일 조회
  findOne(id: number): Promise<Point> {
    return this.pointRepository.findOne({ where: { id } });
  }

  // userId로 선택한 사용자의 모든 상벌점 데이터 조회
  async fetchPointByUserId(userId: number): Promise<Point[]> {
    return this.pointRepository.findBy({ userId });
  }

  // id로 선택한 상벌점 데이터 조회 (데이터정보, 사용자정보, 규정정보)
  async fetchPointByUserIdAndRegulateId(id: number): Promise<Point | null> {
    return this.pointRepository.findOne({
      where: { id: Number(id) },
      select: ['regulate', 'user'],
    });
  }

  // 삭제
  async delete(id: number): Promise<Point | void> {
    await this.pointRepository.delete({ id });
  }
  // 추가
  async add(data: Point): Promise<void> {
    await this.pointRepository.save(data);
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
        })
        .where('id = :id', { id })
        .execute();
    }
  }
}
