import React, { useEffect, useState } from 'react';
import { List, Input } from 'antd';
import classNames from 'classnames';

import { useAppSelector } from '@/store/hooks';
import { Stock } from '@/idl';

import Chart from './chart';
import styles from './index.module.scss';

const { Search } = Input;

const StockList: React.FC = () => {
  const [current, setCurrent] = useState('AAPL');

  const data = useAppSelector(state => state.stock.value);
  const [showData, setShowData] = useState<Stock[]>([]);

  const currentStock = data?.find(item => item.symbol === current);

  useEffect(() => {
    setShowData(data);
  }, [data]);

  const handleSearch = (value: string) => {
    if (!value) {
      setShowData(data || []);
    } else {
      setShowData(
        data?.filter(
          item =>
            item.name_en.toLowerCase().includes(value.toLowerCase()) ||
            item.name_cn?.toLowerCase().includes(value.toLowerCase())
        ) || []
      );
    }
  };

  return (
    <div className={styles['list-wrapper']}>
      <div>
        <div className={styles.header}>
          <div className={styles.title}>股票列表</div>
          <Search
            placeholder="股票搜素"
            style={{ width: 400 }}
            onSearch={handleSearch}
          />
        </div>
        <List
          size="small"
          className={styles.list}
          bordered
          dataSource={showData}
          renderItem={item => (
            <List.Item
              className={classNames([
                current === item.symbol ? styles.active : '',
                styles.item,
              ])}
              onClick={() => setCurrent(item.symbol)}
            >
              {item.name_en}
              {item.name_cn && `（${item.name_cn}）`}
            </List.Item>
          )}
        />
      </div>
      <Chart {...currentStock}></Chart>
    </div>
  );
};

export default StockList;
