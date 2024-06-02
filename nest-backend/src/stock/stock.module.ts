import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockInfo } from './stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockInfo])],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
