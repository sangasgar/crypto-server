/* eslint-disable react/prop-types */
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function SymbolItems({ value }) {
  return (
    <Option value={value}>{value}</Option>
  );
}

export default SymbolItems;
