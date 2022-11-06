/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { hash, getRandom } from '../util/text';
import { User } from './../entity/User.entity'; 
import { Response, Request } from 'express';
import { AzureActiveDirectoryPasswordAuthentication } from "typeorm/driver/sqlserver/authentication/AzureActiveDirectoryPasswordAuthentication";

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

 async addUser(req: Request, name: string, grade: number, classNum: number, number: number, res: Response) {
  const { phone, account, password, role} = req.body; //선생님이 중복으로 계정 생성을 하는가?
  const isUser = await this.findOne(phone);
  if(isUser) {
    return res.status(400).send({
      success: false,
      msg: '이미 해당하는 유저가 있습니다.'
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
}