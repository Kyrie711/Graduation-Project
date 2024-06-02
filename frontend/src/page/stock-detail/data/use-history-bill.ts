import axios from 'axios';
import useSwr from 'swr';
import { PBackendUrl } from '@/consts';

export interface Bill {
  中单净流入: number;
  中单流入净占比: number;
  主力净流入: number;
  主力净流入占比: number;
  大单净流入: number;
  大单流入净占比: number;
  小单净流入: number;
  小单流入净占比: number;
  收盘价: number;
  日期: string;
  涨跌幅: number;
  股票代码: string;
  股票名称: string;
  超大单净流入: number;
  超大单流入净占比: number;
}

interface Req {
  code?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetcher = async ([_, req]: any): Promise<Bill[]> => {
  const options = req.code
    ? {
        params: {
          code: req.code,
        },
      }
    : {};
  return axios.get(`${PBackendUrl}/history-bill`, options).then(res => {
    return res.data;
  });
};

export const useBill = (req?: Req) => {
  const getKeys = (req?: Req) => {
    if (!req?.code) {
      return null;
    }
    return ['bill', req];
  };
  const res = useSwr(getKeys(req), fetcher);
  return res;
};
