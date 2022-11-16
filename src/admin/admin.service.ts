/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { hash, getRandom } from '../util/text';
import { User } from './../entity/User.entity'; 
import { Response, Request } from 'express';
import { Error } from "sequelize";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(account: string) {
    return await this.userRepository.findOneBy({ account });
  }

  async changePassword(req: Request, res: Response, prepw: string, nextpw: string) {
    const { account } = req.body;
    const user = await this.findOne(account);
    const salt = getRandom('all', 10);
    if(!user){
      return res.status(400).send({
        success: false,
        msg: '존재하지 않는 유저입니다.',
      });
    }else{
      if(user.password === hash(prepw + user.salt)){ 
      const newPw = hash(nextpw + salt);
      await this.userRepository// 바꿔온 비번을 
      .createQueryBuilder()
      .update(User)
      .set({
        password: newPw,
        salt: salt,
      })
      .where('account = :account', {user})
      .execute();
          res.status(200).send({
            success: true,
            msg: '비밀번호를 성공적으로 변경했습니다.',
        });
      }
    }
  }

 async addUser(req: Request, name: string, grade: number, classNum: number, number: number, phone: string, account: string, password: string, role: number, res: Response) { //선생님이 중복으로 계정 생성을 하는가?
  const isUser = await this.userRepository.findOneBy({ phone });
  if(isUser) {
    return res.status(400).send({
      success: false,
      msg: '이미 해당하는 유저가 있습니다.',
      isUser
    })
  }else{
      if (grade === 0) grade = null
      if (classNum === 0) classNum = null
      if (number === 0) number = null
      if (name === "") {
      return res.status(400).send({
        success: false,
        msg: "이름을 입력해주세요"
      })
      }
    const salt = getRandom('all', 10);
    const encrypt = hash(password + salt);
    await this.userRepository.insert({
      name: name,
      grade: grade,
      classNum: classNum,
      number: number,
      phone: phone,
      account: account,
      password: encrypt,
      position: role,
      salt: salt
    });
    res.status(200).send({
      success: true,
      msg: "성공적으로 유저를 생성하였습니다."
    })
  }
 }
 async addUserMany(req: Request, res: Response) {
    const arr = req.body;
    const overlapedUser = [];
    for(let i = 0; i<arr.length; i++){
        const isUser = await this.userRepository.find({
          where: {
            grade: arr[i].grade,
            classNum: arr[i].classNum,
            number: arr[i].number,
            phone: arr[i].phone,
            account: arr[i].account
          }
        })
        if(!isUser){
        const salt = getRandom('all', 10);
        const encrypt = hash(arr[i].password + salt);
        await this.userRepository.insert({
        name: arr[i].name,
        grade: arr[i].grade,
        classNum: arr[i].classNum,
        number: arr[i].number,
        phone: arr[i].phone,
        account: arr[i].account,
        password: encrypt,
        position: arr[i].role,
        salt: salt
      });
    res.status(201).send({
      success: true,
      msg: '성공적으로 유저를 생성했습니다.'
    })
  } else {
    overlapedUser[i] = arr[i];
  }
  }
  res.status(400).send({
    success: false,
    msg: "이미 해당하는 유저가 있습니다.",
    overlapedUser
  })
  }
}