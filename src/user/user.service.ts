/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../entity/user.entity';

@Injectable()
export class UserService {
  remove: any;
  create: any;
  findOne: any;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async FindByGrade(grade: number, classNum: number, number: number): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { grade, classNum, number },
        select: ['id', 'name', 'grade', 'classNum', 'number'],
        relations: ['points'],
      });
    } catch (err) {
      console.log(err);
    }
  }
}