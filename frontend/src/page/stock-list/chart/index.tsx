import React, { useCallback, useEffect, useState } from 'react';
import { Chart } from '@antv/g2';
import { Radio, Flex } from 'antd';
import dayjs from 'dayjs';

import styles from './index.module.scss';

interface IProps {
  symbol?: string;
  name_cn?: string;
  name_en?: string;
}

const curDay = dayjs().format('YYYY-MM-DD');
const sevenDaysAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
const oneMonthAgo = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
const sixMonthsAgo = dayjs().subtract(6, 'month').format('YYYY-MM-DD');
const oneYearAgo = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
const threeYearsAgo = dayjs().subtract(3, 'year').format('YYYY-MM-DD');
const fiveYearsAgo = dayjs().subtract(5, 'year').format('YYYY-MM-DD');

enum TimeType {
  sevenDays,
  oneMonth,
  sixMonths,
  oneYear,
  threeYears,
  fiveYears,
}

const TimeMap = {
  [TimeType.sevenDays]: sevenDaysAgo,
  [TimeType.oneMonth]: oneMonthAgo,
  [TimeType.sixMonths]: sixMonthsAgo,
  [TimeType.oneYear]: oneYearAgo,
  [TimeType.threeYears]: threeYearsAgo,
  [TimeType.fiveYears]: fiveYearsAgo,
};

const ChartComponent: React.FC<IProps> = ({
  symbol = 'AAPL',
  name_cn,
  name_en,
}) => {
  const [timeType, setTimeType] = useState(TimeType.oneYear);

  const renderChart = useCallback(
    (symbol: string) => {
      const chart = new Chart({
        padding: 50,
        container: 'chart',
      });

      const start = TimeMap[timeType];

      chart
        .data({
          type: 'fetch',
          value: `http://127.0.0.1:5000/stock-data?start=${start}&end=${curDay}&symbol=${symbol}`,
          format: 'json',
        })
        .encode('x', 'Date')
        .encode('y', 'Close')
        .scale('y', {
          nice: true,
        });

      chart.line();

      chart.axis({
        x: {
          labelLineWidth: 20,
          labelAutoRotate: false,
          labelSpacing: 0,
          title: '日期',
          titleSpacing: 0,
        },
        y: {
          title: '股价',
          titleSpacing: 0,
        },
      });

      chart.render();
    },
    [timeType]
  );

  useEffect(() => {
    renderChart(symbol);
  }, [renderChart, symbol]);

  return (
    <div className={styles.chart}>
      <div className={styles.header}>
        <div style={{ marginBottom: '20px' }}>{`${name_en} ${name_cn}`}</div>
        <Flex align="center">
          <div className={styles.time}>时间筛选：</div>
          <Radio.Group
            defaultValue={TimeType.oneYear}
            value={timeType}
            onChange={v => setTimeType(v.target.value)}
          >
            <Radio.Button value={TimeType.sevenDays}>近七天</Radio.Button>
            <Radio.Button value={TimeType.oneMonth}>近一个月</Radio.Button>
            <Radio.Button value={TimeType.sixMonths}>近半年</Radio.Button>
            <Radio.Button value={TimeType.oneYear}>近一年</Radio.Button>
            <Radio.Button value={TimeType.threeYears}>近三年</Radio.Button>
            <Radio.Button value={TimeType.fiveYears}>近五年</Radio.Button>
          </Radio.Group>
        </Flex>
      </div>
      <div id="chart" />
    </div>
  );
};

export default ChartComponent;
