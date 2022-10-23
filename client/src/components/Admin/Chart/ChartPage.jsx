/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from '@qognicafinance/react-lightweight-charts';
import axios from 'axios';
import { Select, Typography } from 'antd';
import { get5m } from '../../../Redux/Actions/data5mAction';
import './ChartPage.css';
import { get15m } from '../../../Redux/Actions/data15mAction';
import { get30m } from '../../../Redux/Actions/data30mAction';
import { get1h } from '../../../Redux/Actions/data1hAction';
import { get2h } from '../../../Redux/Actions/data2hAction';
import { get6h } from '../../../Redux/Actions/data6hAction';
import SymbolItems from './SymbolItems/SymbolItems';

const { Text } = Typography;
function ChartPage() {
  const dispatch = useDispatch();
  const [value, setValue] = useState(false);
  const { user } = useSelector((state) => state);
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [positions, setPositions] = useState([]);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    axios.get('/api/positions').then((res) => {
      setPositions(res.data);
    });
    dispatch(get5m({ id: user.id, symbol }));
    dispatch(get15m({ id: user.id, symbol }));
    dispatch(get30m({ id: user.id, symbol }));
    dispatch(get1h({ id: user.id, symbol }));
    dispatch(get2h({ id: user.id, symbol }));
    dispatch(get6h({ id: user.id, symbol }));
    const interval = setInterval(() => {
      setValue(!value);
    }, 60000);
    return () => clearInterval(interval);
  }, [value, update]);
  const { data5m } = useSelector((state) => state);
  const { data15m } = useSelector((state) => state);
  const { data30m } = useSelector((state) => state);
  const { data1h } = useSelector((state) => state);
  const { data2h } = useSelector((state) => state);
  const { data6h } = useSelector((state) => state);

  const params = {
    options: {
      alignLabels: true,
      timeScale: {
        rightOffset: 16,
        barSpacing: 7,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        borderColor: '#fff000',
        visible: true,
        timeVisible: true,
        secondsVisible: false,
      },
    },

    candlestickSeries: [{
      data: data5m.map((el) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close,
      })),
    }],
    candlestickSeries15: [{
      data: data15m.map((el) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close,
      })),
    }],
    candlestickSeries30: [{
      data: data30m.map((el) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close,
      })),
    }],
    candlestickSeries1h: [{
      data: data1h.map((el) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close,
      })),
    }],
    candlestickSeries2h: [{
      data: data2h.map((el) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close,
      })),
    }],
    candlestickSeries6h: [{
      data: data6h.map((el) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close,
      })),
    }],
  };
  const symbolClickHandler = (val) => {
    setSymbol(val);
    setUpdate(true);
    setTimeout(() => {
      setUpdate(false);
    }, 2000);
  };
  return (
    <div className="charts">
      {update ? <Text type="success">Сохранено</Text> : null}
      <div className="symbolChange">
        <Select
          showSearch
          placeholder="Select a person"
          optionFilterProp="children"
          onChange={symbolClickHandler}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
        >
          {positions.map((el) => <SymbolItems key={el.id} value={el.symbol} />)}
        </Select>
      </div>
      <h1>График на 5 минут</h1>
      <Chart
        options={params.options}
        candlestickSeries={params.candlestickSeries}
        autoWidth
        height={320}
      />
      <h1>График на 15 минут</h1>
      <Chart
        options={params.options}
        candlestickSeries={params.candlestickSeries15}
        autoWidth
        height={320}
      />
      <h1>График на 30 минут</h1>
      <Chart
        options={params.options}
        candlestickSeries={params.candlestickSeries30}
        autoWidth
        height={320}
      />
      <h1>График на 1 час</h1>
      <Chart
        options={params.options}
        candlestickSeries={params.candlestickSeries1h}
        autoWidth
        height={320}
      />
      <h1>График на 2 часа</h1>
      <Chart
        options={params.options}
        candlestickSeries={params.candlestickSeries2h}
        autoWidth
        height={320}
      />
      <h1>График на 6 часов</h1>
      <Chart
        options={params.options}
        candlestickSeries={params.candlestickSeries6h}
        autoWidth
        height={320}
      />
    </div>
  );
}

export default ChartPage;
