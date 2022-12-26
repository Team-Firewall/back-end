/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Regulate } from '../entity/regulate.entity';
import { Request, Response } from "express";

@Injectable()
export class RegulateService {
  remove: any;
  create: any;
  findOne: any;
  constructor(
    @InjectRepository(Regulate)
    private regulateRepository: Repository<Regulate>,
  ) {}

  async FindRegulate(checked: string) {
    try {
      return await this.regulateRepository.find({
        where: { checked },
        select: ['id','checked','division', 'regulate', 'score'],
      });

    } catch (err) {
      console.log(err);
    }

  }

  async RegulateList() {
    const data = this.regulateRepository.find({
      select: ['id','checked','division', 'regulate', 'score'],
    });
    return data;
  }

  async RegulateCreate(req: Request, res: Response) {
    const data = req.body;
    for(let i in data){
      const { checked, division, regulate, score } = data[i];
      console.log(checked, division, regulate, score);
      await this.regulateRepository.insert({
        checked,
        division,
        regulate,
        score,
      });

    };
    res.status(200).json({
      success: true,
      msg: '성공적으로 상벌점 규정을 등록하였습니다.'
    });
  }

  async RegulateUpdate(req: Request, res: Response) {
    const data = req.body;
      const { id, checked, division, regulate, score } = data;
      await this.regulateRepository.update(id, {
        checked,
        division,
        regulate,
        score,
      });
    res.status(200).json({
      success: true,
      msg: '성공적으로 상벌점 규정을 수정하였습니다.'
    });
  }

  async RegulateDelete(req: Request, res: Response) {
    const data = req.body;
    for (let i in data) {
      const { id } = data[i];
      await this.regulateRepository.delete(id);
    }
    res.status(200).json({
      success: true,
      msg: '성공적으로 상벌점 규정을 삭제하였습니다.'
    });
  }
}