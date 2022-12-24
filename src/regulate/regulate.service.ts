/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Regulate } from '../entity/regulate.entity';

@Injectable()
export class RegulateService {
  remove: any;
  create: any;
  findOne: any;
  constructor(
    @InjectRepository(Regulate)
    private regulateRepository: Repository<Regulate>,
  ) {}

  async FindRegulate(checked: string): Promise<Regulate[]> {
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
}