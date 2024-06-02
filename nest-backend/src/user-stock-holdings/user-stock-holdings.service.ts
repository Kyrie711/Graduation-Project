import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStockHoldings } from './user-stock-holdings.entity';

@Injectable()
export class UserStockHoldingsService {
  constructor(
    @InjectRepository(UserStockHoldings)
    private readonly userStockHoldingsRepository: Repository<UserStockHoldings>,
  ) {}

  findAll(): Promise<UserStockHoldings[]> {
    return this.userStockHoldingsRepository.find();
  }

  findByUsername(username: string): Promise<UserStockHoldings[]> {
    return this.userStockHoldingsRepository.find({ where: { username } });
  }

  findOne(username: string, stock_code: string): Promise<UserStockHoldings> {
    return this.userStockHoldingsRepository.findOne({
      where: { username, stock_code },
    });
  }

  create(userStockHolding: UserStockHoldings): Promise<UserStockHoldings> {
    return this.userStockHoldingsRepository.save(userStockHolding);
  }

  async update(
    username: string,
    stock_code: string,
    updateData: Partial<UserStockHoldings>,
  ): Promise<void> {
    await this.userStockHoldingsRepository.update(
      { username, stock_code },
      updateData,
    );
  }

  async remove(username: string, stock_code: string): Promise<void> {
    await this.userStockHoldingsRepository.delete({ username, stock_code });
  }
}
