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
 async addUser(req: Request, res: Response) {
    const arr = req.body;
    const overlapedUser = [];
    const user = [];
    if(arr.length > 1 ){
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
        if(arr[i].grade === 0) arr[i].grade = null;
        if(arr[i].classNum === 0) arr[i].classNum = null;
        if(arr[i].number === 0) arr[i].number = null;
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
}else {
  const isUser = await this.userRepository.find({
    where:{
      grade: arr[0].grade,
      classNum: arr[0].classNum,
      number: arr[0].number,
      phone: arr[0].phone,
      account: arr[0].account
    }
  })
  if(isUser.length === 0){
    const salt = getRandom('all', 10);
        const encrypt = hash(arr[0].password + salt);
        await this.userRepository.insert({
        grade: arr[0].grade,
        classNum: arr[0].classNum,
        number: arr[0].number,
        name: arr[0].name,
        phone: arr[0].phone,
        account: arr[0].account,
        password: encrypt,
        permission: arr[0].role,
        salt: salt
      });
    res.status(201).send({
      success: true,
      msg:"성공적으로 유저를 생성하였습니다."
    })
  }else{
    res.status(400).send({
      success:false,
      msg: "중복되는 유저가 있습니다.",
      isUser
    })
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
  async editUser(req: Request, res: Response) {
    const arr = req.body;
    const successReq = [];
    const falseReq = [];
    if(arr.length > 1){
      for(let i=0; i<arr.length; i++){
        const isUser = await this.userRepository.find({
          where: {id: arr[i].id}
        });
        if(isUser.length !== 0){
          await this.userRepository
            .createQueryBuilder()
            .update(User)
            .set({
              grade: arr[i].grade,
              classNum: arr[i].classNum,
              number: arr[i].number,
              name: arr[i].name,
              phone: arr[i].phone,
              permission: arr[i].permission
            })
            .where({id: arr[i].id})
            .execute()
            successReq[i] = arr[i];
        } else {
          falseReq[i] = arr[i];
        }
      }
      if(successReq.length !== 0 && falseReq.length !== 0){
        res.status(200).send({
          success: true,
          msg:'데이터 수정에 성공한 유저입니다.',
          successReq,
          msg2:'데이터를 수정하지 못한 유저입니다.',
          falseReq
        })
      }else if(successReq.length !== 0 && falseReq.length === 0){
        res.status(200).send({
          success: true,
          msg:'데이터 수정에 성공한 유저입니다.',
          successReq,
        })
      }else{
        res.status(400).send({
          success: false,
          msg2:'데이터를 수정하지 못한 유저입니다.',
          falseReq
        })
      }
    } else {
      const isUser = await this.userRepository.find({
        where:{id: arr[0].id}
      });
      if(isUser.length !== 0){
        await this.userRepository
            .createQueryBuilder()
            .update(User)
            .set({
              grade: arr[0].grade,
              classNum: arr[0].classNum,
              number: arr[0].number,
              name: arr[0].name,
              phone: arr[0].phone,
              permission: arr[0].permission
            })
            .where({id: arr[0].id})
            .execute()
        res.status(200).send({
          success: true,
          msg:'데이터 수정에 성공하였습니다.'
        })
      } else {
        res.status(400).send({
          success: false,
          msg: '해당하는 유저를 찾을 수 없습니다'
        })
      }
    }
  }
}