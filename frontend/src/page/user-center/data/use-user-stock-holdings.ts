import axios from 'axios';
import useSwr from 'swr';
import { BackendUrl } from '@/consts';

export interface StockHoldings {
  username: string;
  stock_code: string;
  stock_name: string;
  purchase_price: number;
  purchase_date: number;
  market: string;
}

interface Req {
  user: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetcher = async ([_, req]: [string, Req]): Promise<StockHoldings[]> => {
  return axios
    .get(`${BackendUrl}/user-stock-holdings/${req.user}`)
    .then(res => {
      return res.data;
    });
};

export const useStockHoldings = (req?: Req) => {
  const keys: any = req?.user ? ['user-stock-holdings-user', req] : null;
  const res = useSwr(keys, fetcher);
  return res;
};
