import { Module } from '@nestjs/common';
import { UserStockHoldingsService } from './user-stock-holdings.service';
import { UserStockHoldingsController } from './user-stock-holdings.controller';
import { UserStockHoldings } from './user-stock-holdings.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserStockHoldings])],
  controllers: [UserStockHoldingsController],
  providers: [UserStockHoldingsService],
})
export class UserStockHoldingsModule {}
