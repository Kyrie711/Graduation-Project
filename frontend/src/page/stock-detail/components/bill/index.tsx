import React, { useEffect, useCallback, useMemo } from 'react';
import { Chart } from '@antv/g2';

import { Bill, useBill } from '../../data/use-history-bill';
import { useRecommend } from '../../data/use-recommend';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { Alert, Spin, Tooltip } from 'antd';
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const getOptNum = (num?: number) => {
  return Number(((num || 0) / 10000).toFixed(2));
};

const bills = [
  '小单净流入',
  '中单净流入',
  '主力净流入',
  '大单净流入',
  '超大单净流入',
];

const StockDashboard: React.FC = () => {
  const { id } = useParams();
  const { data } = useBill({ code: id });
  const { data: recommendData, isLoading } = useRecommend({ code: id });
  const transformedData = useMemo(
    () =>
      data?.reduce<
        {
          name: string;
          value: number;
          time: string;
        }[]
      >((prv, cur) => {
        const transformedItems = Object.keys(cur)
          .filter(key => bills.includes(key))
          .map(key => ({
            name: key,
            value: getOptNum(cur[key as keyof Bill] as number),
            time: cur.日期,
          }));

        return prv.concat(transformedItems);
      }, []),
    [data]
  );

  const createBarChart = useCallback(() => {
    const barChart = new Chart({
      container: 'bar-chart-container',
      height: 300,
      autoFit: true,
    });

    barChart.data(transformedData);

    barChart
      .interval() // 绘制条形图
      .encode('x', 'time') // x轴使用time编码
      .encode('y', 'value') // y轴使用value编码
      .slider('x', {}) // x轴伸缩尺
      .slider('y', {}) // y轴伸缩尺
      .encode('color', 'name') // 通过name来区分不同维度的数据，绘制不同的图形
      .transform({ type: 'dodgeX' }) // 对数据进行转换
      .tooltip({ channel: 'y', valueFormatter: (d: any) => `${d}万` });

    barChart.axis({
      x: {
        labelLineWidth: 20,
        labelAutoRotate: false,
        labelSpacing: 0,
        title: '净流入类型',
        titleSpacing: 0,
      },
      y: {
        title: '净流入资金 / 万',
      },
    });

    barChart.render();
  }, [transformedData]);

  const createLineChart = useCallback(() => {
    if (!transformedData) {
      return;
    }
    const lineChart = new Chart({
      container: 'line-chart-container',
      autoFit: true,
    });

    lineChart.data({
      type: 'inline',
      value: transformedData,
    });

    lineChart
      .line()
      .encode('x', (d: any) => new Date(d.time))
      .encode('y', 'value')
      .slider('x', {})
      .encode('color', 'name')
      .tooltip({ channel: 'y', valueFormatter: (d: any) => `${d}万` });

    lineChart.axis({
      x: {
        title: '日期',
      },
      y: {
        title: '净流入 / 万',
      },
    });

    lineChart.render();
  }, [transformedData]);

  useEffect(() => {
    createBarChart();
    createLineChart();
  }, [createBarChart, createLineChart]);

  return (
    <div>
      {/* <div>
        <p>收盘价: {selectedData.收盘价}</p>
        <p>涨跌幅: {selectedData.涨跌幅}</p>
      </div> */}

      <Alert
        message={
          <>
            最新收盘价预测
            <Tooltip title="由近期收盘价以及资金流动特点根据LSTM算法预测得出">
              {' '}
              <QuestionCircleOutlined />
            </Tooltip>
          </>
        }
        description={
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            spinning={isLoading}
          >
            {recommendData
              ? recommendData.toFixed(2)
              : '正在根据资金流动信息和股票历史数据信息股价预测'}
          </Spin>
        }
        type="info"
      />
      <div className={styles.header}>资金流动趋势图如下</div>
      <div id="line-chart-container"></div>
      <div id="bar-chart-container"></div>

      {/* <div className={styles['bar-chart']}>
        <div>指标说明</div>
        <div id="bar-chart-container"></div>
      </div> */}
    </div>
  );
};

export default StockDashboard;
