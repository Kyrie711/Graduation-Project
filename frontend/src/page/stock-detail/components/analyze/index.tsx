import {
  Descriptions,
  DescriptionsProps,
  Flex,
  Radio,
  Spin,
  Tooltip,
} from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useBaseInfo } from '../../data/use-base-info';
import { useQuoteHistory, HistoryStock } from '../../data/use-quote-history';
import { useStockDataReal } from '../../data/use-stock-data-real';

import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { coloredNum, formatNumberToUnit } from '@/util';
import { useParams } from 'react-router-dom';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs';
import styles from './index.module.scss';

const curDay = dayjs().format('YYYYMMDD');
const oneMonthAgo = dayjs().subtract(1, 'month').format('YYYYMMDD');
const sixMonthsAgo = dayjs().subtract(6, 'month').format('YYYYMMDD');
const oneYearAgo = dayjs().subtract(1, 'year').format('YYYYMMDD');
const threeYearsAgo = dayjs().subtract(3, 'year').format('YYYYMMDD');
const fiveYearsAgo = dayjs().subtract(5, 'year').format('YYYYMMDD');

enum TimeType {
  real,
  oneMonth,
  sixMonths,
  oneYear,
  threeYears,
  fiveYears,
}

const TimeMap = {
  [TimeType.real]: curDay,
  [TimeType.oneMonth]: oneMonthAgo,
  [TimeType.sixMonths]: sixMonthsAgo,
  [TimeType.oneYear]: oneYearAgo,
  [TimeType.threeYears]: threeYearsAgo,
  [TimeType.fiveYears]: fiveYearsAgo,
};

const Analyze: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading } = useBaseInfo({ code: id });
  const [timeType, setTimeType] = useState(TimeType.oneYear);
  const params = useMemo(() => {
    if (timeType === TimeType.real) {
      return {
        code: id,
        beg: curDay,
        end: curDay,
        klt: 1,
      };
    } else {
      return {
        code: id,
        beg: TimeMap[timeType],
        end: curDay,
        klt: 101,
      };
    }
  }, [id, timeType]);
  const { data: historyData } = useQuoteHistory(params);
  const { data: realData } = useStockDataReal(
    timeType === TimeType.real ? { code: id } : {}
  );

  const items: DescriptionsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: '股票名称',
        children: <span style={{ fontWeight: 600 }}>{data?.股票名称}</span>,
      },
      {
        key: '2',
        label: '所处行业',
        children: data?.所处行业,
        span: 2,
      },
      {
        key: '3',
        label: '总市值',
        children: formatNumberToUnit(data?.总市值 || 0),
      },
      {
        key: '4',
        label: '流通市值',
        children: formatNumberToUnit(data?.流通市值 || 0),
      },
      {
        key: '5',
        label: 'ORE',
        children: (
          <>
            <span>{coloredNum(data?.ROE || 0, false, false, false)}</span>
            <Tooltip title="股本回报率">
              {' '}
              <QuestionCircleOutlined />
            </Tooltip>
          </>
        ),
      },
      {
        key: '6',
        label: '毛利率',
        children: `${data?.毛利率.toFixed(2)}%`,
      },
      {
        key: '7',
        label: '净利润',
        children: <span>{formatNumberToUnit(data?.净利润 || 0)}</span>,
      },
      {
        key: '8',
        label: '净利率',
        children: coloredNum(
          Number(data?.净利率.toFixed(2)) || 0,
          false,
          false,
          false
        ),
      },
    ],
    [data]
  );

  const createLineChart = useCallback(() => {
    if (!historyData) {
      return;
    }
    const lineChart = new Chart({
      container: 'a-line-chart',
      autoFit: true,
      height: 300,
    });

    const getCurData = () => {
      if (
        realData &&
        dayjs(historyData[historyData.length - 1].日期).unix() >
          dayjs(realData[0].更新时间).unix()
      ) {
        const curHistoryData = [...historyData];
        curHistoryData.pop();
      }
      const curData = realData
        ? // @ts-expect-error ts-i
          historyData.concat({
            日期: realData[0].更新时间,
            收盘: realData[0].最新价,
          })
        : historyData;

      return curData;
    };
    lineChart.data(getCurData());

    lineChart
      .line() // 绘制折线图
      .encode('x', (d: HistoryStock) => new Date(d.日期)) // x轴为日期编码
      .encode('y', '收盘') // y 轴为收盘价格
      .scale('y', {
        nice: true,
      })
      .tooltip({
        // 提示
        channel: 'y',
        items: [
          {
            channel: 'y',
            name: '最新价',
          },
        ],
      });
    lineChart.axis({
      x: {
        labelAutoRotate: false,
        title: '日期',
      },
      y: {
        title: '股价',
      },
    });

    lineChart.render();
  }, [historyData, realData]);

  useEffect(() => {
    createLineChart();
  }, [createLineChart]);

  return (
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      spinning={isLoading}
    >
      {data ? (
        <Descriptions title="股票基本信息" bordered items={items} />
      ) : null}
      <div className={styles.header}>
        <div className={styles.title}>股票趋势图</div>
      </div>
      <Flex align="center" style={{ marginBottom: 20 }}>
        {realData && (
          <Flex align="center" style={{ width: 300 }}>
            <div className={styles.stock}>{realData?.[0].最新价}</div>
            <div style={{ fontSize: 20, marginLeft: 8 }}>
              {coloredNum(realData?.[0].涨跌额 || 0, false, false, true, true)}

              <span style={{ fontSize: 18, marginLeft: 4 }}>
                {coloredNum(
                  realData?.[0].涨跌幅 || 0,
                  true,
                  false,
                  true,
                  true,
                  true
                )}
              </span>
            </div>
          </Flex>
        )}
        <div>时间筛选：</div>
        <Radio.Group
          defaultValue={TimeType.threeYears}
          value={timeType}
          onChange={v => setTimeType(v.target.value)}
        >
          <Radio.Button value={TimeType.real}>实时</Radio.Button>
          <Radio.Button value={TimeType.oneMonth}>近一个月</Radio.Button>
          <Radio.Button value={TimeType.sixMonths}>近半年</Radio.Button>
          <Radio.Button value={TimeType.oneYear}>近一年</Radio.Button>
          <Radio.Button value={TimeType.threeYears}>近三年</Radio.Button>
          <Radio.Button value={TimeType.fiveYears}>近五年</Radio.Button>
        </Radio.Group>
      </Flex>
      <div id="a-line-chart"></div>
    </Spin>
  );
};

export default Analyze;
