import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Space,
  Table,
  Tabs,
  Alert,
  Input,
  Button,
  Tooltip,
  message,
} from 'antd';
import type { TableProps, TabsProps } from 'antd';
import { useAppSelector } from '@/store/hooks';
import dayjs from 'dayjs';

import {
  useStockList,
  stockList,
  stockTypes,
  StockItem,
} from '../../data/use-stock-data';
import {
  useStockHoldings,
  StockHoldings,
} from '../../data/use-user-stock-holdings';
import axios from 'axios';

import styles from './index.module.scss';
import { coloredNum, formatNumberToUnit } from '@/util';
import { RedoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BackendUrl } from '@/consts';

const { Search } = Input;

const tabs: TabsProps['items'] = stockList.map(item => ({
  key: item,
  label: item,
}));

const getColumns = (
  onClickName: (code: string) => void,
  username?: string,
  StockHoldingsData?: StockHoldings[],
  onSelect?: (params: StockHoldings) => void,
  date?: number
): TableProps<StockItem>['columns'] => {
  return [
    {
      title: '股票名称',
      dataIndex: '股票名称',
      key: '股票名称',
      render(value, record) {
        return (
          <a
            onClick={() => {
              onClickName(record.股票代码);
            }}
          >
            {value}
          </a>
        );
      },
    },
    {
      title: '最新价',
      dataIndex: '最新价',
      key: '最新价',
      sorter: (a, b) => b.最新价 - a.最新价,
    },
    {
      title: '涨跌幅',
      dataIndex: '涨跌幅',
      key: '涨跌幅',
      render: text => coloredNum(text, true),
      sorter: (a, b) => Number(b.涨跌幅) - Number(a.涨跌幅),
    },
    {
      title: '涨跌额',
      dataIndex: '涨跌额',
      key: '涨跌额',
      render: text => coloredNum(text),
      sorter: (a, b) => Number(b.涨跌额) - Number(a.涨跌额),
    },
    {
      title: '成交量',
      dataIndex: '成交量',
      key: '成交量',
      render: text => formatNumberToUnit(text),
      sorter: (a, b) => b.成交量 - a.成交量,
    },
    {
      title: '成交额',
      dataIndex: '成交额',
      key: '成交额',
      render: text => formatNumberToUnit(text),
      sorter: (a, b) => b.成交额 - a.成交额,
    },
    {
      title: '最高',
      dataIndex: '最高',
      key: '最高',
    },
    {
      title: '最低',
      dataIndex: '最低',
      key: '最低',
    },
    {
      title: '今开',
      dataIndex: '今开',
      key: '今开',
    },
    {
      title: '昨日收盘',
      dataIndex: '昨日收盘',
      key: '昨日收盘',
      sorter: (a, b) => b.昨日收盘 - a.昨日收盘,
    },
    {
      title: '换手率',
      dataIndex: '换手率',
      key: '换手率',
      render: text => `${text}%`,
      sorter: (a, b) => b.换手率 - a.换手率,
    },
    {
      title: '动态市盈率',
      dataIndex: '动态市盈率',
      key: '动态市盈率',
      sorter: (a, b) => b.动态市盈率 - a.动态市盈率,
    },
    {
      title: '管理自选股',
      key: '管理自选股',
      render: (_, record) => {
        const canSelect = StockHoldingsData?.find(
          item =>
            item.username === username && item.stock_code === record.股票代码
        );
        const params: StockHoldings = {
          username: username || '',
          stock_name: record.股票名称,
          stock_code: record.股票代码,
          purchase_date: date || 0,
          purchase_price: record.最新价,
          market: record.市场类型,
        };
        return (
          <Space size="middle" onClick={() => onSelect?.(params)}>
            {canSelect ? (
              <Tooltip title="该股票已被选入">
                <Button type="link" disabled={!!canSelect}>
                  选入
                </Button>
              </Tooltip>
            ) : (
              <Button type="link" disabled={!!canSelect}>
                选入
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
};

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [lastTime, setLastTime] = useState<string>('');
  const [tab, setTab] = useState<stockTypes>(stockList[0]);
  const { data, isLoading, mutate } = useStockList({
    type: tab,
  });
  const [showData, setShowData] = useState<StockItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const navigate = useNavigate();
  const { data: StockHoldingsData, mutate: StockHoldingsMutate } =
    useStockHoldings();

  const user = useAppSelector(state => state.auth.user);
  const success = useCallback(
    (name: string) => {
      messageApi.open({
        type: 'success',
        content: `股票 ${name} 已被选入成功`,
      });
    },
    [messageApi]
  );

  const checkDetail = useCallback(
    (code: string) => {
      navigate(`/detail/${code}`);
    },
    [navigate]
  );

  const handleSelect = useCallback(
    async (params: StockHoldings) => {
      try {
        await axios.post(`${BackendUrl}/user-stock-holdings`, {
          ...params,
        });
        await StockHoldingsMutate();
        success(params.stock_name);
      } catch (e) {
        console.log(e);
      }
    },
    [StockHoldingsMutate, success]
  );

  const columns = useMemo(() => {
    const date = dayjs().unix();
    return getColumns(
      checkDetail,
      user.username,
      StockHoldingsData,
      handleSelect,
      date
    );
  }, [StockHoldingsData, checkDetail, handleSelect, user.username]);

  // useEffect(() => {
  //   if (StockHoldingsData && user.username) {

  //   }
  // }, [StockHoldingsData, user.username])

  const onChange = (value: string) => {
    setTab(value as stockTypes);
  };

  const handleSearch = (value: string) => {
    if (!value) {
      setShowData(data || []);
    } else {
      setShowData(
        data?.filter(item =>
          item.股票名称.toLowerCase().includes(value.toLowerCase())
        ) || []
      );
    }
  };

  const handleReset = () => {
    setShowData(data || []);
    setInputValue('');
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    setShowData(data);
    let latestUpdate = new Date(data[0].更新时间);

    // 遍历数组，找到最新的更新时间
    for (let i = 1; i < data.length; i++) {
      const currentUpdate = new Date(data[i].更新时间);
      if (currentUpdate > latestUpdate) {
        latestUpdate = currentUpdate;
      }
    }
    setLastTime(dayjs(latestUpdate).format('YYYY-MM-DD HH:mm:ss'));
  }, [data]);
  return (
    <>
      {contextHolder}
      <div className={styles.stock}>
        <div className={styles.header}>
          <Search
            placeholder="股票搜素"
            style={{ width: 300 }}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onSearch={handleSearch}
          />
          <Button type="link" onClick={handleReset}>
            重置
          </Button>
          {lastTime && (
            <>
              <Alert
                style={{ display: 'inline-block', marginLeft: 'auto' }}
                message={`市场行情最后更新时间: ${lastTime}`}
                type="info"
              />
              <Button type="link" onClick={() => mutate()}>
                <RedoOutlined />
                <span style={{ marginLeft: 2 }}>查看最新</span>
              </Button>
            </>
          )}
        </div>

        <Tabs
          defaultActiveKey={stockList[0]}
          items={tabs}
          onChange={onChange}
        />
        <Table columns={columns} dataSource={showData} loading={isLoading} />
      </div>
    </>
  );
};

export default App;
