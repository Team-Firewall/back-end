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
}
