/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Point } from '../entity/point.entity';
import { Request, Response } from 'express';
import { SMS_Service } from '../util/sms'
import { time } from 'console';

@Injectable()
export class PointService {
  remove: any;
  create: any;
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    ) {}

  // 발급된 상벌점 데이터 출력]

  async findAll() {
      const date = new Date();
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()

      const startDate = <Date>(new Date(year, month, day -7, hour, minute, second));
      const endDate = <Date>(new Date(year, month, day, hour, minute, second));
      const fDate = (startDate).toISOString().split('T')[0];
      const fTime = (startDate).toTimeString().split(' ')[0];
      const firstDate = (fDate+" "+fTime)
      const sDate = (endDate).toISOString().split('T')[0];
      const sTime = (endDate).toTimeString().split(' ')[0];
      const secondDate = (sDate+" "+sTime)
      console.log(firstDate, secondDate)

    const list = await this.pointRepository
      .createQueryBuilder('point')
      .where('point.createdAt BETWEEN :startDate AND :endDate', { startDate: firstDate, endDate: secondDate })
      .select(['point', 'regulate', 'user.id', 'user.grade', 'user.classNum', 'user.number', 'user.name' ])
      .leftJoin('point.user', 'user')
      .leftJoin('point.regulate', 'regulate')
      .getMany();
      
    const data = JSON.stringify(list.map(cb => {
      const createdDate = new Date(cb.createdAt).toISOString().split('T')[0];
      const updatedDate = new Date(cb.updatedAt).toISOString().split('T')[0];
      const createdTime = new Date(cb.createdAt).toTimeString().split(' ')[0];
      const updatedTime = new Date(cb.updatedAt).toTimeString().split(' ')[0];

      return({
        id: cb.id,
        userId: cb.user.id,
        regulateId: cb.regulate.id,
        grade: cb.user.grade,
        class: cb.user.classNum,
        number: cb.user.number,
        name: cb.user.name,
        checked: cb.regulate.checked,
        division: cb.regulate.division,
        regulate: cb.regulate.regulate,
        score: cb.regulate.score,
        reason: cb.reason,
        issuer: cb.issuer,
        createdDate: createdDate,
        createdTime: createdTime,
        updatedDate: updatedDate,
        updatedTime: updatedTime,
      })
    }));
    return data;
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

  // 해당 기간의 상벌점 데이터 조회
  async FindByDate(req: Request, res: Response) {
    const {firstDate, secondDate} = req.body;
    const date = new Date();
    const time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    const startDate = firstDate+' '+time;
    const endDate = secondDate+' '+time;
    const list = await this.pointRepository
      .createQueryBuilder('point')
      .where('point.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .select(['point', 'regulate', 'user.id', 'user.grade', 'user.classNum', 'user.number', 'user.name' ])
      .leftJoin('point.user', 'user') 
      .leftJoin('point.regulate', 'regulate')
      .getMany();
      
    const data = (list.map(cb => {
      const createdDate = new Date(cb.createdAt).toISOString().split('T')[0];
      const updatedDate = new Date(cb.updatedAt).toISOString().split('T')[0];
      const createdTime = new Date(cb.createdAt).toTimeString().split(' ')[0];
      const updatedTime = new Date(cb.updatedAt).toTimeString().split(' ')[0];
      return({
        id: cb.id,
        userId: cb.user.id,
        regulateId: cb.regulate.id,
        grade: cb.user.grade,
        class: cb.user.classNum,
        number: cb.user.number,
        name: cb.user.name,
        checked: cb.regulate.checked,
        division: cb.regulate.division,
        regulate: cb.regulate.regulate,
        score: cb.regulate.score,
        reason: cb.reason,
        issuer: cb.issuer,
        createdDate: createdDate,
        createdTime: createdTime,
        updatedDate: updatedDate,
        updatedTime: updatedTime,
      })
    }));
    if(data.length !== 0){
      res.status(200).send({
        success: true,
        msg:"성공적으로 값을 조회했습니다.",
        data
      })
    }else{
      res.status(400).send({
        success: false,
        msg: `${startDate}부터 ${endDate}까지의 상벌점 발급 내역이 없습니다`
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

    const student = req.body;
    for(let i = 0; i < student.length; i++){
      const {userId, reason, regulateId, token} = student[i];
      const base64payload = token.split('.')[1];
      const payload = Buffer.from(base64payload, 'base64');
      const result = JSON.parse(payload.toString());
      const issuer = result.name;

      const data = await this.pointRepository.insert({
        userId: userId,
        reason: reason,
        regulateId: regulateId,
        issuer: issuer
      });

      if(data){
        const sms = new SMS_Service();
        const user = await this.pointRepository.findOne({
          where: {id: data.identifiers[0].id},
          relations: ['user', 'regulate']
        })
        const {name, phone} = user.user;
        const {reason, issuer} = user;
        const { score, regulate, checked } = user.regulate;
        sms.sendMessage(phone, `${name}학생 ${checked} ${score}점 발급 (${regulate} ${ reason.length === 0 ? '' : `-${reason}` }) - ${issuer}`).catch(console.log);
      }else{
        res.status(400).send({
          success: false,
          msg: '유저가 존재하지 않거나, 잘못된 규정입니다.'
        })
        break;
      }
    }
    res.status(200).send({
      success: true,
      msg: '성공적으로 상벌점 내역을 추가 했습니다.'
    })

  }

  //규정 수정
  async update(req: Request, res: Response) {
    const arr = req.body;
    const successed = [];
    const failed = [];
    if(arr.length > 1){
      for(let i=0; i<arr.length; i++){
        const isPoint = await this.findOne(arr[i].id);
        if(isPoint){
          await this.pointRepository
            .createQueryBuilder()
            .update(Point)
            .set({
              userId: arr[i].userId,
              regulateId: arr[i].regulateId,
              reason: arr[i].reason,
              issuer: arr[i].issuer,
            })
            .where({id: arr[i].id})
            .execute()
          successed[i] = arr[i];
        }else{
          failed[i] = arr[i];
        }
      }
      if(successed.length !== 0 && failed.length !==0){
        return res.status(200).send({
          success: true,
          msg:'해당하는 발급 내역이 수정되었습니다.',
          successed,
          msg2:'해당하는 발급 내역이 없어 수정에 실패하였습니다.',
          failed
        })
      }else if(successed.length !== 0 && failed.length === 0){
        return res.status(200).send({
          success: true,
          msg:'해당하는 발급 내역이 수정되었습니다.',
          successed
        })
      }else{
        return res.status(400).send({
          success: false,
          msg:'해당하는 발급 내역이 없어 수정에 실패하였습니다',
          failed
        })
      }
    } else {
      const existedPoint = await this.findOne(arr[0].id);
      if(existedPoint){
        const result = 
        await this.pointRepository
          .createQueryBuilder()
          .update(Point)
          .set({
            userId: arr[0].userId,
            regulateId: arr[0].regulateId,
            reason: arr[0].reason,
            issuer: arr[0].issuer,
          })
          .where({id: arr[0].id})
          .execute()
        res.status(200).send({
            success: true,
            msg:"성공적으로 내용을 수정했습니다.",
            result
        })
      }else{
        res.status(400).send({
          success: false,
          msg:`${arr[0].id}라는 ID를 가진 발급 내역을 찾을 수 없습니다.`
        })
      }
    }
  }
}
