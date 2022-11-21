/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { hash, getRandom } from '../util/text';
import { User } from './../entity/User.entity'; 
import { Response, Request } from 'express';

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
      grade: grade,
      classNum: classNum,
      number: number,
      name: name,
      phone: phone,
      account: account,
      password: encrypt,
      permission: role,
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
    const user = [];
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
      if(isUser.length === 0){
        const salt = getRandom('all', 10);
        const encrypt = hash(arr[i].password + salt);
        await this.userRepository.insert({
        grade: arr[i].grade,
        classNum: arr[i].classNum,
        number: arr[i].number,
        name: arr[i].name,
        phone: arr[i].phone,
        account: arr[i].account,
        password: encrypt,
        permission: arr[i].role,
        salt: salt
      });
      user[i] = arr[i];
  } else {
    overlapedUser[i] = arr[i];
  }
  }
  if(user.length !== 0 && overlapedUser.length !== 0){
    res.status(201).send({
      success: true,
      msg1: '성공적으로 유저를 생성하였습니다.',
      user,
      msg2: '중복되는 유저가 있습니다',
      overlapedUser
    })
  }else if(user.length !== 0){
    res.status(201).send({
      success: true,
      msg: '성공적으로 유저를 생성하였습니다',
      user
    })
  } else {
    res.status(400).send({
      success: false,
      msg: '중복되는 유저가 있습니다.',
      overlapedUser
    })
  }
  }
  //유저 삭제
  async deleteUser(res: Response, req: Request){
    const user = req.body;
    const data = [];
    const unsignedUser = [];

    if(user.length > 1){
      for(let i=0; i<user.length; i++){
        const isId = await this.userRepository.findBy({
          id: user[i].id
        });
        if(isId.length === 0){
          unsignedUser[i] = user[i].id;
        }else{
          await this.userRepository.delete(user[i].id)
          data[i] = user[i];
        }
    }
    res.status(200).send({
      success: true,
      msg:'성공적으로 유저를 삭제하였습니다.',
      data,
      msg2:"해당 ID를 가진 유저가 존재하지 않습니다.",
      unsignedUser
    })
  } else {
    const isId = await this.userRepository.findBy({
      id: user[0].id
    })
    if(isId.length === 0){
      return res.status(400).send({
        success: false,
        msg:"해당하는 ID를 가진 유저가 존재하지 않습니다.",
        unsignedUser
      })
    }
    const result = await this.userRepository.delete(user[0].id)
      res.status(200).send({
        success: true,
        msg: '성공적으로 유저를 삭제하였습니다.',
        result
      })
    }
  }
}