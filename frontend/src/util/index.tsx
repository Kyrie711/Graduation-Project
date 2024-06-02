import { ReactElement } from 'react';
import dayjs from 'dayjs';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

export const sleep = (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const coloredNum = (
  num: number,
  isPercent?: boolean,
  needArrow: boolean = true,
  isBold: boolean = true,
  isSymbol: boolean = false,
  needBrackets: boolean = false
): ReactElement => {
  const curText = isPercent ? `${num}%` : num;
  if (num > 0) {
    return (
      <span style={{ color: '#e21111', fontWeight: isBold ? 600 : 400 }}>
        {needBrackets && '('}
        {isSymbol && '+'}
        {curText}
        {needArrow && <ArrowUpOutlined />}
        {needBrackets && ')'}
      </span>
    );
  } else if (num < 0) {
    return (
      <span style={{ color: '#389e0d', fontWeight: isBold ? 600 : 400 }}>
        {needBrackets && '('}
        {curText}
        {needArrow && <ArrowDownOutlined />}
        {needBrackets && ')'}
      </span>
    );
  } else
    return (
      <span>
        {needBrackets && '('}
        {curText}
        {needBrackets && ')'}
      </span>
    );
};
export function formatNumberToUnit(num: number) {
  if (typeof num !== 'number') {
    return num;
  }

  const units = ['', '万', '亿', '万亿'];
  const thresholds = [1, 1e4, 1e8, 1e12];

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (num >= thresholds[i]) {
      const value = num / thresholds[i];
      return value.toFixed(2) + units[i];
    }
  }

  return num.toString();
}

// 参数形式 '2024-05-11'
export function getDayOfWeek(time: string) {
  const daysOfWeek = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  const dayIndex = dayjs(time).day();
  return daysOfWeek[dayIndex];
}
