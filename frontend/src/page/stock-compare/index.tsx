import React, { useState } from 'react';
import { Select } from 'antd';
import { useAppSelector } from '@/store/hooks';

import Chart from './chart';

const StockCompare: React.FC = () => {
  const [value1, setValue1] = useState<string>();
  const [value2, setValue2] = useState<string>();

  const options = useAppSelector(state => state.stock.value).map(item => ({
    value: item.symbol,
    label: item.name_cn || item.name_en,
  }));

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleValueChange = (value: string, isFirst: boolean) => {
    if (isFirst) {
      setValue1(value);
    } else {
      setValue2(value);
    }
  };

  return (
    <div
      style={{
        margin: '40px 0 0 200px',
        borderBottom: '1px solid rgb(221, 224, 228)',
      }}
    >
      <div style={{ marginBottom: 20, fontSize: 20, fontWeight: 500 }}>
        股票选择
      </div>
      <div
        style={{
          paddingBottom: 20,
          borderBottom: '1px solid rgb(221, 224, 228)',
        }}
      >
        <Select
          showSearch
          placeholder="请选择第一支股票"
          optionFilterProp="label"
          style={{ width: 400, marginRight: 80 }}
          value={value1}
          onChange={value => handleValueChange(value, true)}
          filterOption={filterOption}
          options={options}
        />
        <Select
          showSearch
          placeholder="请选择第二支股票"
          optionFilterProp="label"
          style={{ width: 400 }}
          value={value2}
          onChange={value => handleValueChange(value, false)}
          filterOption={filterOption}
          options={options}
        />
      </div>
      <Chart symbol1={value1} symbol2={value2}></Chart>
    </div>
  );
};

export default StockCompare;
