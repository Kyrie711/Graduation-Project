import axios from 'axios';
import useSwr, { SWRConfiguration } from 'swr';

import { Stock } from '../idl';

const fetcher = async (): Promise<Stock[]> => {
  return axios.get('http://localhost:3000/stock').then(res => {
    return res.data;
  });
};

export const useStockInfo = (options?: SWRConfiguration) => {
  const res = useSwr('stock-info', fetcher, options);
  return res;
};
