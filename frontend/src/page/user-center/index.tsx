import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';
import Header from '@/components/header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useStockHoldings } from './data/use-user-stock-holdings';
import { BackendUrl, PBackendUrl } from '@/consts';
import axios from 'axios';
import { StockItem } from '../home/data/use-stock-data';
import { Button, Space, Table, TableProps, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { coloredNum } from '@/util';
import authService from '@/util/auth';
import { setUser } from '@/store/auth-slice';

interface Stock {
  username: string;
  stock_code: string;
  stock_name: string;
  current_price: number;
  purchase_price: number;
  purchase_date: number;
  market: string;
  price_difference: number;
}

const getColumns = (
  onClick: (code: string) => void,
  onDelete: (username: string, code: string, name: string) => void
): TableProps<Stock>['columns'] => {
  return [
    {
      title: '股票名称',
      dataIndex: 'stock_name',
      key: '股票名称',
      render(value, record) {
        return <a onClick={() => onClick(record.stock_code)}>{value}</a>;
      },
    },
    {
      title: '选入时价格',
      dataIndex: 'purchase_price',
      key: '选入时价格',
    },
    {
      title: '选入时间',
      dataIndex: 'purchase_date',
      key: '选入时间',
      render(value) {
        return dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
      sorter: (a, b) => b.purchase_date - a.purchase_date,
    },
    {
      title: '当前价格',
      dataIndex: 'current_price',
      key: '当前价格',
    },
    {
      title: '价格差异',
      dataIndex: 'price_difference',
      key: '价格差异',
      render: text => coloredNum(text),
    },
    {
      title: '对应市场',
      dataIndex: 'market',
      key: '对应市场',
    },
    {
      title: '操作',
      key: '操作',
      render: (_, record) => {
        // const canSelect = StockHoldingsData?.find(
        //   item =>
        //     item.username === username && item.stock_code === record.股票代码
        // );
        // const params: StockHoldings = {
        //   username: username || '',
        //   stock_name: record.股票名称,
        //   stock_code: record.股票代码,
        //   purchase_date: date || 0,
        //   purchase_price: record.最新价,
        //   market: record.市场类型,
        // };
        // onClick={() => onSelect?.(params)}
        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() =>
                onDelete(record.username, record.stock_code, record.stock_name)
              }
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
};

const Center: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  // 看看由哪些市场需要去请求，不是对应原来那个
  const { data, mutate } = useStockHoldings({ user: user.username });
  const [showData, setShowData] = useState<Stock[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useAppDispatch();
  const checkAuth = useCallback(async () => {
    const { success, user } = await authService.checkAuth();
    if (success) {
      dispatch(setUser(user));
    } else {
      // 如果用户未登录，则重定向到登录页面或显示未登录提示
      // navigate('/login', {
      //   replace: true,
      // });
    }
  }, [dispatch]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth, dispatch]);

  const checkDetail = useCallback(
    (code: string) => {
      navigate(`/detail/${code}`);
    },
    [navigate]
  );

  const success = (name: string) => {
    messageApi.open({
      type: 'info',
      content: `股票 ${name} 已被移除`,
    });
  };

  const onDelete = async (username: string, code: string, name: string) => {
    try {
      await axios.delete(
        `${BackendUrl}/user-stock-holdings/${username}/${code}`
      );
      await mutate();
      success(name);
    } catch (e) {
      console.log(e);
    }
  };
  const columns = getColumns(checkDetail, onDelete);

  useEffect(() => {
    async function fetchData() {
      if (!data) {
        return;
      }
      setIsLoading(true);
      const promises = [
        // axios.get(`${PBackendUrl}/stock-data`),
        // axios.get(`${PBackendUrl}/stock-data`, {
        //   params: {
        //     type: '深A',
        //   },
        // }),
        // axios.get(`${PBackendUrl}/stock-data`, {
        //   params: {
        //     type: '沪A',
        //   },
        // }),
        // axios.get(`${PBackendUrl}/stock-data`, {
        //   params: {
        //     type: '美股',
        //   },
        // }),
        // axios.get(`${PBackendUrl}/stock-data`, {
        //   params: {
        //     type: '期货',
        //   },
        // }),
        // axios.get(`${PBackendUrl}/stock-data`, {
        //   params: {
        //     type: '行业板块',
        //   },
        // }),
        axios.get(`${PBackendUrl}/stock-data`, {
          params: {
            type: ['深A', '沪A', '北A', '美股', '期货', '行业板块', '概念板块'],
          },
        }),
      ];
      const res = await Promise.all(promises);
      let curRes: StockItem[] = [];
      res.forEach(stock => {
        curRes = curRes.concat(stock.data);
      });
      const arr: Stock[] = data?.map(item => {
        const stock = curRes.find(
          subItem => subItem.股票代码 === item.stock_code
        );
        (item as Stock).current_price = stock?.最新价 || 0;
        (item as Stock).price_difference = Number(
          ((stock?.最新价 || 0) - Number(item.purchase_price || 0)).toFixed(2)
        );
        return item as Stock;
      });
      setIsLoading(false);
      setShowData(arr);
    }

    fetchData();
  }, [data]);

  return (
    <>
      {contextHolder}
      <div className={styles.user}>
        <Header needNavigate></Header>
        <div className={styles.main}>
          <div className={styles.header}>自选股管理</div>
          <Table
            virtual
            rowKey="stock_code"
            columns={columns}
            dataSource={showData}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Center;
