import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockInfo } from './stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockInfo)
    private readonly stockRepository: Repository<StockInfo>,
  ) {}

  async findAll(): Promise<StockInfo[]> {
    const res = await this.stockRepository.find();
    return res;
  }
}
