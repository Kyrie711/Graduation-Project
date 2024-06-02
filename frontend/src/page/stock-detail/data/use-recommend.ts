import axios from 'axios';
import useSwr from 'swr';
import { PBackendUrl } from '@/consts';

// export interface RecommendValue {
//   value: number;
// }

interface Req {
  code?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetcher = async ([_, req]: any): Promise<number> => {
  const options = req.code
    ? {
        params: {
          code: req.code,
        },
      }
    : {};
  return axios.get(`${PBackendUrl}/recommend`, options).then(res => {
    return res.data;
  });
};

export const useRecommend = (req?: Req) => {
  const getKeys = (req?: Req) => {
    if (!req?.code) {
      return null;
    }
    return ['recommend', req];
  };
  const res = useSwr(getKeys(req), fetcher, {
    revalidateIfStale: false,
  });
  return res;
};
