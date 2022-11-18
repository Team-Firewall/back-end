/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Point } from '../entity/point.entity';
import { Request, Response } from 'express';
import { SMS_Service } from '../sms/sms.service'
import { Regulate } from 'src/entity/regulate.entity';

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
    return this.pointRepository.find({
      relations: ['regulate']
    });
  }

  // id 값으로 상벌점 데이터 조회
  findOne(id: number): Promise<Point> {
    return this.pointRepository.findOne({ where: { id } });
  }

  // userId 값으로 상벌점 데이터 조회
 async FindUserId(userId: number): Promise<Point[]> {
    return this.pointRepository.find({ 
      where: { userId: Number(userId) },
      select: ['id', 'reason', 'createdAt', 'updatedAt'],
      relations: ['regulate'],
    });
  }

  // id로 선택한 상벌점 데이터 조회 (데이터정보, 사용자정보, 규정정보)
  async FindRelate(id: number): Promise<Point> {
      return this.pointRepository.findOne({
        where: {id}, 
        relations: ['user', 'regulate']
      })
    }
  async FindByDate(req: Request, res: Response) {
    const {userId, firstDate, secondDate} = req.body;
    const result = await this.pointRepository.find({
      select: ["regulate","reason","createdAt"],
      where: {
        userId: userId,
        createdAt: Between(firstDate, secondDate),
      },
      relations: ["user", "regulate"]
    });
    
    if(result.length !== 0){
      res.status(200).send({
      success: true,
      msg:`${firstDate}일 부터 ${secondDate}까지의 상벌점 내역입니다.`,
      result
    })
    } else {
      res.status(400).send({
        success: false,
        msg: `${firstDate}일 부터 ${secondDate}까지의 상벌점 발급내역이 없거나 해당하는 유저를 찾을 수 없습니다.`
      })
    }
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
    const issuer = result.name;
    
    const data = await this.pointRepository.insert({
      userId,
      regulateId,
      reason,
      issuer
    });
    if(data) {
        res.status(200).send({
        success: true,
        msg: '성공적으로 상벌점을 부여하였습니다.',
      })

      // SMS 전송
      const sms = new SMS_Service();
      const user = await this.pointRepository.findOne({
        where: { id: data.identifiers[0].id },
        relations: ['user', 'regulate'],
      });
      const { name, phone } = user.user;
      const { reason, issuer } = user;
      const { score, regulate, checked } = user.regulate;
      sms.sendMessage(phone, `${name}학생 ${checked} ${score}점 발급 (${regulate} ${ reason.length === 0 ? '' : `-${reason}` }) - ${issuer}`);
    } else {
      res.status(400).send({
        success: false,
        msg: '유저가 존재하지 않거나 잘못된 규정입니다.'
      })
    }
  }

  수정
  async update(id: number, point: Point): Promise<void> {
    const existedUser = await this.findOne(id);
    if (existedUser) {
      await this.pointRepository
        .createQueryBuilder()
        .update(Point)
        .set({
          regulateId: point.regulateId,
          reason: point.reason,
        })
        .where('id = :id', { id })
        .execute();
    }
  }
  //규정 수정
  // async update(req: Request, res: Response) {
  //   const arr = req.body;
  //   if(arr.length > 1){
  //     for(let i=0; i<arr.length; i++){
  //       const existedUser = await this.findOne(arr[i].id);
  //       if(existedUser){
  //         await this.pointRepository
  //           .createQueryBuilder()
  //           .update(Point)
  //           .set({
  //             regulateId: arr[i].regulateId,
  //             reason: arr[i].reason,
  //           })
  //           .where('id = :id', arr[i].id)
  //           .execute()
  //         res.status(200).send({
  //           success: true,
  //           msg:"성공적으로 내용을 수정했습니다."
  //         })
  //       }else{
  //         res.status(400).send({
  //           success: false,
  //           msg:`${arr.id}라는 ID를 가진 유저를 찾을 수 없습니다.`
  //         })
  //       }
  //     }
  //   } else {
  //     const existedUser = await this.findOne(arr.id);
  //     if(existedUser){
  //       await this.pointRepository
  //         .createQueryBuilder()
  //         .update(Point)
  //         .set({
  //           regulateId: arr.regulateId,
  //           reason: arr.reason
  //         })
  //         .where('id = :id', arr.id)
  //         .execute()
  //         res.status(200).send({
  //           success: true,
  //           msg:"성공적으로 내용을 수정했습니다."
  //         })
  //     }else{
  //       res.status(400).send({
  //         success: false,
  //         msg:`${arr.id}라는 ID를 가진 유저를 찾을 수 없습니다.`
  //       })
  //     }
  //   }
  // }
}
