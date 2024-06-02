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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetcher = async (): Promise<StockHoldings[]> => {
  return axios.get(`${BackendUrl}/user-stock-holdings`).then(res => {
    return res.data;
  });
};

export const useStockHoldings = () => {
  const res = useSwr('user-stock-holdings', fetcher);
  return res;
};
