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
          position
        },
        select: [
          'id', 
          'name',
          'grade', 
          'classNum', 
          'number', 
          'position'
        ],
        // relations: ['points'],
      });
    } catch (err) {
      console.log(err);
    }
  }
}
