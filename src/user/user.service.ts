/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../entity/user.entity';
import { Request, Response } from "express";

@Injectable()
export class UserService {
  remove: any;
  create: any;
  findOne: any;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async FindUser( permission: number, grade: number, classNum: number, number: number, name: string): Promise<User[]> {
    try {
      if (grade === 0) grade = undefined
      if (classNum === 0) classNum = undefined
      if (number === 0) number = undefined
      if (name === "") name = undefined

      return await this.userRepository.find({
        where: { 
          name,
          grade, 
          classNum, 
          number, 
          permission
        },
        select: [
          'id', 
          'name',
          'grade', 
          'classNum', 
          'number', 
          'permission'
        ],
        // relations: ['points'],
      });
    } catch (err) {
      console.log(err);
    }
  }

  async UserList() {
    const data = this.userRepository.find({
      where: [
        { permission: 3 },
        { permission: 4 },
      ],
      select: [
        'id',
        'name',
        'grade',
        'classNum',
        'number',
        'phone',
        'account',
        'permission'
      ],
      relations: ['parents'],
    })

    try {
      if (data) {
        return data;
      }
    } catch {
      console.log('error')
    }

  }

  async FindTotal (req: Request, res: Response) {
    const date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    const fst = <Date>(new Date(year, 2, 2, hour, minute, second));
    const snd = <Date>(new Date(year, month, day, hour, minute, second));
    const fDate = (fst).toISOString().split('T')[0];
    const sDate = (snd).toISOString().split('T')[0];

    const {startDate, endDate} = req.body

    const firstDate = startDate !== undefined ? startDate+" 00:00:00" : fDate+" 00:00:00";
    const secondDate = endDate !== undefined ? endDate+" 23:59:59" : sDate+" 23:59:59";

    const userId = await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .where('permission = 3')
      .orWhere('permission = 4')
      .addSelect(subQuery => {
        return subQuery
          .select("SUM(regulate.score)", "cnt")
          .from('point', 'point')
          .leftJoin('regulate', 'regulate', 'regulate.id = point.regulateId')
          .where("point.userId = user.id")
          .andWhere("point.createdAt BETWEEN :firstDate AND :secondDate", { firstDate, secondDate })
          .groupBy('point.userId');
      }, "cnt")
      .addSelect(subQuery => {
        return subQuery
          .select("SUM(CASE WHEN regulate.score > 0 THEN regulate.score ELSE 0 END)", "bonus")
          .from('point', 'point')
          .leftJoin('regulate', 'regulate', 'regulate.id = point.regulateId')
          .where("point.userId = user.id")
          .andWhere("point.createdAt BETWEEN :firstDate AND :secondDate", { firstDate, secondDate })
          .groupBy('point.userId');
      }, "bonus")
      .addSelect(subQuery => {
        return subQuery
          .select("SUM(CASE WHEN regulate.score < 0 THEN regulate.score ELSE 0 END)", "minus")
          .from('point', 'point')
          .leftJoin('regulate', 'regulate', 'regulate.id = point.regulateId')
          .where("point.userId = user.id")
          .andWhere("point.createdAt BETWEEN :firstDate AND :secondDate", { firstDate, secondDate })
          .groupBy('point.userId');
      }, "minus")
      .getRawMany();

    const data = userId.map(cb => {
      return({
        userId: cb.user_id,
        grade: cb.user_grade,
        class: cb.user_class,
        number: cb.user_number,
        name: cb.user_name,
        permission: cb.user_permission,
        bonus: cb.bonus ? cb.bonus : 0,
        minus: cb.minus ? cb.minus : 0,
        total: cb.cnt ? cb.cnt : 0,
      })
    })

    res.status(200).json(data);

  }

  async issueScoreByUser (req: Request, res: Response) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('user.id , user.account, user.name, user.permission')
      .where('permission = 0')
      .orWhere('permission = 1')
      .orWhere('permission = 2')
      .addSelect(subQuery => {
        return subQuery
          .select("COUNT(case WHEN regulate.checked = '상점' THEN regulate.score ELSE 0 END)", "cnt_plus")
          .from('point', 'point')
          .leftJoin('regulate', 'regulate', 'regulate.id = point.regulateId')
          .where("point.issuerId = user.account")
          .groupBy('point.issuerId');
      }, "plus_cnt")
      .addSelect(subQuery => {
        return subQuery
          .select("SUM(case WHEN regulate.checked = '상점' THEN regulate.score ELSE 0 END)", "sum_plus")
          .from('point', 'point')
          .leftJoin('regulate', 'regulate', 'regulate.id = point.regulateId')
          .where("point.issuerId = user.account")
          .groupBy('point.issuerId');
      }, "plus_sum")
      .addSelect(subQuery => {
        return subQuery
          .select("COUNT(case WHEN regulate.checked = '벌점' THEN regulate.score ELSE 0 END)", "cnt_minus")
          .from('point', 'point')
          .leftJoin('regulate', 'regulate', 'regulate.id = point.regulateId')
          .where("point.issuerId = user.account")
          .groupBy('point.issuerId');
      }, "minus_cnt")
      .addSelect(subQuery => {
        return subQuery
          .select("SUM(case WHEN regulate.checked = '벌점' THEN regulate.score ELSE 0 END)", "sum_minus")
          .from('point', 'point')
          .leftJoin('regulate', 'regulate', 'regulate.id = point.regulateId')
          .where("point.issuerId = user.account")
          .groupBy('point.issuerId');
      }, "minus_sum")
      .getRawMany()

    console.log(user)
    res.status(200).json(user);
  }
}
