import { Controller, Get } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockInfo } from './stock.entity';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  findAll(): Promise<StockInfo[]> {
    return this.stockService.findAll();
  }
}
