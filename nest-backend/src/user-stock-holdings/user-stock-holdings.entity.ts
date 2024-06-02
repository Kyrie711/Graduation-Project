import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class UserStockHoldings {
  @PrimaryColumn()
  username: string;

  @PrimaryColumn()
  stock_code: string;

  @Column()
  stock_name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  purchase_price: number;

  @Column()
  purchase_date: number;

  @Column()
  market: string;

  // @Column('decimal', { precision: 10, scale: 2 })
  // current_price: number;

  // // Getter to compute price difference
  // get price_difference(): number {
  //   return Number(this.current_price) - Number(this.purchase_price);
  // }
}
