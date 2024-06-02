import axios from 'axios';
import useSwr from 'swr';
import { PBackendUrl } from '@/consts';

export const stockList = [
  '沪深京A股',
  '沪深A股',
  '沪A',
  '深A',
  '北A',
  '可转债',
  '期货',
  '创业板',
  '美股',
  '港股',
  '中概股',
  '新股',
  '科创板',
  '沪股通',
  '深股通',
  '行业板块',
  '概念板块',
  '沪深系列指数',
  '上证系列指数',
  '深证系列指数',
  'ETF',
  'LOF',
] as const;

export interface StockItem {
  今开: number;
  动态市盈率: number;
  市场类型: string;
  总市值: number;
  成交量: number;
  成交额: number;
  换手率: number;
  昨日收盘: number;
  更新时间: string;
  最低: number;
  最新交易日: string;
  最新价: number;
  最高: number;
  流通市值: number;
  涨跌幅: number;
  涨跌额: number;
  股票代码: string;
  股票名称: string;
  行情ID: string;
  量比: number;
}

export type stockTypes = (typeof stockList)[number];

interface StockListReq {
  type?: stockTypes;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetcher = async ([_, req]: [string, StockListReq | undefined]): Promise<
  StockItem[]
> => {
  const options = req && req.type !== '沪深京A股' ? { params: req } : {};
  const res = await axios.get(`${PBackendUrl}/stock-data`, options);
  return res.data;
};

export const useStockList = (req?: StockListReq) => {
  const keys: [string, StockListReq | undefined] = ['stock-data', req];
  const res = useSwr(keys, fetcher);
  return res;
};
