import axios from 'axios';
import useSwr from 'swr';
import { PBackendUrl } from '@/consts';

  export interface BillboardStock {
    上榜原因: string;
    上榜日期: string;
    净买额占总成交比: string;
    市场总成交额: string;
    成交额占总成交比: string;
    换手率: string;
    收盘价: string;
    流通市值: string;
    涨跌幅: string;
    股票代码: string;
    股票名称: string;
    解读: string;
    龙虎榜买入额: string;
    龙虎榜净买额: string;
    龙虎榜卖出额: string;
    龙虎榜成交额: string;
  }

interface Req {
  time?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetcher = async ([_, req]: [string, Req | undefined]): Promise<
  BillboardStock[]
> => {
  const options = req
    ? {
        params: {
          date: req.time,
        },
      }
    : {};
  return axios.get(`${PBackendUrl}/billboard`, options).then(res => {
    return res.data;
  });
};

export const useBillboard = (req?: Req) => {
  const keys: [string, Req | undefined] = ['Billboard', req];
  const res = useSwr(keys, fetcher);
  return res;
};
