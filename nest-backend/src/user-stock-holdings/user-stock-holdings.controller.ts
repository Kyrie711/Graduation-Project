import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserStockHoldingsService } from './user-stock-holdings.service';
import { UserStockHoldings } from './user-stock-holdings.entity';

@Controller('user-stock-holdings')
export class UserStockHoldingsController {
  constructor(
    private readonly userStockHoldingsService: UserStockHoldingsService,
  ) {}

  @Get()
  findAll() {
    return this.userStockHoldingsService.findAll();
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.userStockHoldingsService.findByUsername(username);
  }

  @Get(':username/:stock_code')
  findOne(
    @Param('username') username: string,
    @Param('stock_code') stock_code: string,
  ) {
    return this.userStockHoldingsService.findOne(username, stock_code);
  }

  @Post()
  create(@Body() userStockHolding: UserStockHoldings) {
    return this.userStockHoldingsService.create(userStockHolding);
  }

  @Put(':username/:stock_code')
  update(
    @Param('username') username: string,
    @Param('stock_code') stock_code: string,
    @Body() updateData: Partial<UserStockHoldings>,
  ) {
    return this.userStockHoldingsService.update(
      username,
      stock_code,
      updateData,
    );
  }

  @Delete(':username/:stock_code')
  remove(
    @Param('username') username: string,
    @Param('stock_code') stock_code: string,
  ) {
    return this.userStockHoldingsService.remove(username, stock_code);
  }
}
