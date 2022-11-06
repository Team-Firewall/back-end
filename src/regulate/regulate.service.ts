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

  async FindRegulate(checked: number): Promise<Regulate[]> {
    try {
      return await this.regulateRepository.find({
        where: { checked },
        select: ['id', 'regulate', 'score'],
      });

    } catch (err) {
      console.log(err);
    }
  }
}