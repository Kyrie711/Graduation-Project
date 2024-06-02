import axios from 'axios';
import useSwr from 'swr';
import { PBackendUrl } from '@/consts';

export interface BaseInfo {
  股票代码: number;
  股票名称: string;
  '市盈率(动)': number;
  市净率: number;
  所处行业: string;
  总市值: number;
  流通市值: number;
  板块编号: string;
  ROE: number;
  净利率: number;
  净利润: number;
  毛利率: number;
}

interface Req {
  code?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetcher = async ([_, req]: any): Promise<BaseInfo> => {
  const options = req.code
    ? {
        params: {
          code: req.code,
        },
      }
    : {};
  return axios.get(`${PBackendUrl}/baseInfo`, options).then(res => {
    return res.data;
  });
};

export const useBaseInfo = (req?: Req) => {
  const getKeys = (req?: Req) => {
    if (!req?.code) {
      return null;
    }
    return ['base-info', req];
  };
  const res = useSwr(getKeys(req), fetcher);
  return res;
};
