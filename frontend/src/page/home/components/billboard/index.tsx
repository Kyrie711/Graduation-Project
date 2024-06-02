import React, { useEffect, useState } from 'react';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import { Divider, DatePicker, Tag, Table } from 'antd';
import type { TableProps } from 'antd';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { coloredNum, formatNumberToUnit, getDayOfWeek } from '@/util';
import { useBillboard, BillboardStock } from '../../data/use-billboard';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.scss';

dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const getColumns = (
  onClick: (code: string) => void
): TableProps<BillboardStock>['columns'] => {
  return [
    {
      title: '股票名称',
      dataIndex: '股票名称',
      key: '股票名称',
      render(value, record) {
        return <a onClick={() => onClick(record.股票代码)}>{value}</a>;
      },
    },
    {
      title: '收盘价',
      dataIndex: '收盘价',
      key: '收盘价',
    },
    {
      title: '涨跌幅',
      dataIndex: '涨跌幅',
      key: '涨跌幅',
      render: text => coloredNum(text, true),
    },
    {
      title: '流通市值',
      dataIndex: '流通市值',
      key: '流通市值',
      render: text => formatNumberToUnit(text),
    },

    {
      title: '市场总成交额',
      dataIndex: '市场总成交额',
      key: '市场总成交额',
      render: text => formatNumberToUnit(text),
    },
    {
      title: '换手率',
      dataIndex: '换手率',
      key: '换手率',
      render: text => `${text}%`,
    },
    {
      title: '上榜原因',
      dataIndex: '上榜原因',
      key: '上榜原因',
    },
    {
      title: '解读',
      dataIndex: '解读',
      key: '解读',
    },
  ];
};

const Billboard: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs>();
  const navigate = useNavigate();
  const { data } = useBillboard(
    selectedTime
      ? {
          time: selectedTime.format(dateFormat),
        }
      : undefined
  );
  const [curTime, setCurTime] = useState<string>();
  // const curTime = data?.[0]?.上榜日期;
  const realTime = selectedTime?.format(dateFormat) || curTime;
  const day = realTime ? getDayOfWeek(realTime) : '';

  const handleTimeChange = (date: dayjs.Dayjs) => {
    setSelectedTime(date);
  };

  const checkDetail = (code: string) => {
    navigate(`/detail/${code}`);
  };

  const columns = getColumns(checkDetail);

  useEffect(() => {
    if (curTime) {
      return;
    }
    setCurTime(data?.[0]?.上榜日期);
  }, [curTime, data]);
  return (
    <div className={styles.billboard}>
      <div className={styles.header}>
        <span className={styles.title}>龙虎榜数据全览</span>
        {/* <Tooltip title="龙虎榜提供的信息有助于投资者了解市场中的主力资金动向和交易热点，进而做出更明智的投资决策。">
          <QuestionCircleOutlined style={{ color: '#6e6c6c' }} />
        </Tooltip> */}
        <span style={{ color: '#6e6c6c' }}>
          龙虎榜提供的信息有助于投资者了解市场中的主力资金动向和交易热点，进而做出更明智的投资决策。
        </span>
        <Divider />
      </div>

      <div className={styles['time-line']}>
        {realTime && `${realTime} ${day} 上榜个股`}
        {selectedTime?.format(dateFormat) === curTime && (
          <Tag color="blue" style={{ marginLeft: 4 }}>
            最新
          </Tag>
        )}
        <span style={{ color: '#6e6c6c', fontSize: 14, marginLeft: 24 }}>
          历史数据查询：
        </span>
        {curTime && (
          <DatePicker
            defaultValue={dayjs(curTime, dateFormat)}
            maxDate={dayjs(curTime, dateFormat)}
            value={selectedTime}
            onChange={handleTimeChange}
          />
        )}
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Billboard;
