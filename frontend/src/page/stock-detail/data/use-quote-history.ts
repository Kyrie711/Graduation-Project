import axios from 'axios';
import useSwr from 'swr';
import { PBackendUrl } from '@/consts';

export interface HistoryStock {
  开盘: number;
  成交量: number;
  成交额: number;
  振幅: number;
  换手率: number;
  收盘: number;
  日期: string;
  最低: number;
  最高: number;
  涨跌幅: number;
  涨跌额: number;
  股票代码: string;
  股票名称: string;
}

interface Req {
  code?: string;
  beg?: string;
  end?: string;
  klt?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetcher = async ([_, req]: any): Promise<HistoryStock[]> => {
  const options = req.code
    ? {
        params: {
          code: req.code,
          beg: req.beg,
          end: req.end,
          klt: req.klt,
        },
      }
    : {};
  return axios.get(`${PBackendUrl}/get_quote_history`, options).then(res => {
    return res.data;
  });
};

export const useQuoteHistory = (req?: Req) => {
  const getKeys = (req?: Req) => {
    if (!req?.code) {
      return null;
    }
    return ['get_quote_history', req];
  };
  const res = useSwr(getKeys(req), fetcher, {
    refreshInterval: req?.beg === req?.end ? 60000 : 0,
  });
  return res;
};
