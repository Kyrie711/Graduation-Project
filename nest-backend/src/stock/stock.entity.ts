import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StockInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column()
  name_en: string;

  @Column()
  name_cn: string;
}
