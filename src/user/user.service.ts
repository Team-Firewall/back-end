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

  async FindUser( position: number, grade: number, classNum: number, number: number, name: string): Promise<User[]> {
    try {
      return await this.userRepository.find({
        where: { position, grade, classNum, number, name },
        select: ['id', 'position', 'grade', 'classNum', 'number', 'name'],
        // relations: ['points'],
      });
    } catch (err) {
      console.log(err);
    }
  }
}