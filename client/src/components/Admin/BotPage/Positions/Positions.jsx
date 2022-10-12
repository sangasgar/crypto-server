/* eslint-disable react/prop-types */
import React from 'react';
import {
  Checkbox, Col,
} from 'antd';

function Positions({ symbol, id }) {
  return (
    <div className="positions">
      <Col span={8}>
        <Checkbox value={id}>{symbol}</Checkbox>
      </Col>
    </div>
  );
}

export default Positions;
