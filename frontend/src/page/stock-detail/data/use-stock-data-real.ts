import axios from 'axios';
import useSwr from 'swr';
import { PBackendUrl } from '@/consts';

export interface StockReal {
  今开: number;
  代码: string;
  动态市盈率: number;
  名称: string;
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
  行情ID: string;
  量比: number;
}

interface Req {
  code?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetcher = async ([_, req]: any): Promise<StockReal[]> => {
  const options = req.code
    ? {
        params: {
          code: req.code,
        },
      }
    : {};
  return axios.get(`${PBackendUrl}/stock-data-real`, options).then(res => {
    return res.data;
  });
};

export const useStockDataReal = (req?: Req) => {
  const getKeys = (req?: Req) => {
    if (!req?.code) {
      return null;
    }
    return ['stock-real', req];
  };
  const res = useSwr(getKeys(req), fetcher, {
    refreshInterval: 1000,
  });
  return res;
};
