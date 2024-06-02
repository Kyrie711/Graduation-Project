import React, { useCallback, useEffect, useState } from 'react';
import { Chart } from '@antv/g2';
import { Radio, Flex } from 'antd';
import dayjs from 'dayjs';

import styles from './index.module.scss';

interface IProps {
  symbol1?: string;
  symbol2?: string;
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

const ChartComponent: React.FC<IProps> = ({ symbol1, symbol2 }) => {
  const [timeType, setTimeType] = useState(TimeType.oneYear);

  const renderChart = useCallback(
    (symbol1: string, symbol2: string) => {
      const chart = new Chart({
        insetRight: 20,
        container: 'chart',
        autoFit: true,
      });

      const start = TimeMap[timeType];

      chart
        .data({
          type: 'fetch',
          value: `http://127.0.0.1:5000/stock-data-compare?start=${start}&end=${curDay}&symbol1=${symbol1}&symbol2=${symbol2}`,
          format: 'json',
        })
        .encode('x', (d: any) => new Date(d.Date))
        .encode('y', 'Close')
        .encode('color', 'Symbol')
        .axis('y', { title: '股价' })
        .scale('y', { type: 'log' })
        .scale('y', {
          nice: true,
        });

      chart.line();

      chart.render();
    },
    [timeType]
  );

  useEffect(() => {
    if (!symbol1 || !symbol2) {
      return;
    }
    renderChart(symbol1, symbol2);
  }, [renderChart, symbol1, symbol2]);

  return (
    <div className={styles.chart}>
      <div className={styles.header}>
        <Flex align="center">
          <div className={styles.time}>时间筛选：</div>
          <Radio.Group
            defaultValue={TimeType.threeYears}
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
