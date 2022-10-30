/* eslint-disable max-len */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Typography, Button, Checkbox, Row, Select,
} from 'antd';
import Bot from '../../../img/pngwing.png';
import BotPrint from '../../../img/botprint.png';
import './BotPage.css';
import Positions from './Positions/Positions';

const { Option } = Select;
function BotPage() {
  const { user } = useSelector((state) => state);
  const { Text } = Typography;
  const [value, setValue] = useState(false);
  const [symbol, setSymbol] = useState([]);
  const [positions, setPositions] = useState([]);
  const [leverage, setLeverage] = useState(false);
  const [stoploss, setStoploss] = useState(false);
  const [save, setSave] = useState(false);
  const [update, setUpdate] = useState(false);
  const [sizeDeposit, setSizeDeposit] = useState('');
  const [stopLossClear, setStopLossClear] = useState(false);
  let symbolArray = [];

  useEffect(() => {
    axios.post('/bot/bot-status-check', { id: user.id }).then((res) => setValue(res.data.botStatus));
    axios.post('/users/settings', { id: user.id }).then((res) => {
      setSymbol(res.data.Positions);
      setSizeDeposit(res.data.sizeDeposit);
      setLeverage(res.data.leverage);
      setStoploss(res.data.stoploss);
    });
    axios.get('/users/settings').then((res) => {
      setPositions(res.data);
    });
  }, [update]);
  useEffect(() => {
    if (sizeDeposit !== '' || leverage !== false || stoploss !== false) {
      axios.put('/users/settings', { sizeDeposit, id: user.id }).then((res) => {
        setSizeDeposit(res.data.sizeDeposit);
      });
      axios.put('/users/settings', { leverage, id: user.id }).then((res) => {
        setLeverage(res.data.leverage);
      });
      axios.put('/users/settings', { stoploss, id: user.id }).then((res) => {
        setStoploss(res.data.stoploss);
      });
    }
  }, [save]);
  const botHandler = () => {
    axios.put('/bot/bot-status', { id: user.id, botStatus: !value }).then((res) => setValue(res.data.botStatus));
  };
  const clearStopLoss = () => {
    axios.put('/bot/stop-loss-clear', { id: user.id }).then((res) => {
      setStopLossClear(res.data.status);
      setTimeout(() => {
        setStopLossClear(false);
      }, 2000);
    });
  };
  const sizeDepositChangeHandler = (val) => {
    setSizeDeposit(val);
    setSave(true);
    setTimeout(() => {
      setSave(false);
    }, 2000);
  };
  const leverageChangeHandler = (val) => {
    setLeverage(val);
    setSave(true);
    setTimeout(() => {
      setSave(false);
    }, 2000);
  };
  const stoplossChangeHandler = (val) => {
    setStoploss(val);
    setSave(true);
    setTimeout(() => {
      setSave(false);
    }, 2000);
  };
  const onChange = (checkedValues) => {
    symbolArray = checkedValues.map((el) => ({ symbolId: el }));
    axios.put('/users/settings', { symbols: symbolArray, id: user.id }).then((res) => {
      setUpdate(res.data);
      setSave(true);
      setTimeout(() => {
        setSave(false);
      }, 2000);
    });
  };

  return (
    <div className="bot">
      <h1>Управление ботом</h1>
      {save ? <Text type="success">Сохранено</Text> : null}
      <Text>
        Торговая пара:
        {' '}
        {symbol.map((el) => (
          <>
            {el.symbol}
            {' '}
          </>
        ))}
        {' '}
        /
        {' '}
        Размер % стоимости ордера от депозита:
        {' '}
        {sizeDeposit}
        %
        {' '}
        /
        {' '}
        Кредитное плечо:
        {' '}
        {leverage}
        x
        {' '}
        /
        {' '}
        Размер % стоп-лоса от стоимости:
        {' '}
        {stoploss}
        %
      </Text>
      <div className="name1">
        {!value
          ? (
            <>
              Выберите торговые пары:
              <Checkbox.Group
                style={{
                  width: '100%',
                }}
                onChange={onChange}
              >
                {positions?.map((el) => (
                  <Row>
                    <Positions key={el.id} id={el.id} symbol={el.symbol} />
                  </Row>
                ))}
              </Checkbox.Group>
            </>
          ) : (
            <>
              {' '}
              Включенные торговые пары:
              {symbol.map((el) => (
                <>
                  {' '}
                  {el.symbol}
                  {' '}
                </>
              ))}
            </>
          ) }
      </div>
      <div className="name">
        Размер % стоимости ордера от депозита:
        {!value
          ? (

            <Select
              showSearch
              placeholder="Select a deposit"
              optionFilterProp="children"
              onChange={sizeDepositChangeHandler}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              <Option value="5">5</Option>
              <Option value="10">10</Option>
              <Option value="15">15</Option>
              <Option value="20">20</Option>
              <Option value="25">25</Option>
              <Option value="30">30</Option>
              <Option value="35">35</Option>
              <Option value="40">40</Option>
              <Option value="45">45</Option>
              <Option value="50">50</Option>
              <Option value="75">75</Option>
              <Option value="100">100</Option>
            </Select>
          ) : (
            <>
              {' '}
              {sizeDeposit}
              %
            </>
          ) }
      </div>
      <div className="name">
        Кредитное плечо:
        {!value
          ? (
            <Select
              showSearch
              placeholder="Select a leverage"
              optionFilterProp="children"
              onChange={leverageChangeHandler}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              <Option value="1">1x</Option>
              <Option value="3">3x</Option>
              <Option value="5">5x</Option>
              <Option value="10">10x</Option>
              <Option value="15">15x</Option>
              <Option value="20">20x</Option>
              <Option value="25">25x</Option>
              <Option value="30">30x</Option>
              <Option value="35">35x</Option>
              <Option value="40">40x</Option>
              <Option value="45">45x</Option>
              <Option value="50">50x</Option>
              <Option value="100">100x</Option>
            </Select>
          ) : (
            <>
              {' '}
              {leverage}
              x
            </>
          ) }
      </div>
      <div className="name">
        Размер % стоп-лоса от стоимости:
        {!value
          ? (
            <Select
              showSearch
              placeholder="Select a stoploss"
              optionFilterProp="children"
              onChange={stoplossChangeHandler}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              <Option value="1">1x</Option>
              <Option value="5">5%</Option>
              <Option value="10">10%</Option>
              <Option value="15">15%</Option>
              <Option value="20">20%</Option>
              <Option value="25">25%</Option>
              <Option value="30">30%</Option>
              <Option value="35">35%</Option>
              <Option value="40">40%</Option>
              <Option value="45">45%</Option>
              <Option value="50">50%</Option>
              <Option value="75">75%</Option>
              <Option value="95">95%</Option>
              <Option value="100">100%</Option>
            </Select>
          ) : (
            <>
              {' '}
              {stoploss}
              %
            </>
          ) }
      </div>
      {!value ? <img src={Bot} alt="Бот" width={200} /> : <img src={BotPrint} alt="Бот" width={200} />}
      {!value ? <Text className="botText" type="warning">Бот выключен </Text> : <Text className="botText" type="success">Бот запущен</Text>}
      <div className="buttonBot">
        <Button type="primary" onClick={clearStopLoss} shape="round" size="large">
          {!stopLossClear ? <>Очистить стоп-лосс</> : <> Стоп-лосс очищен</>}
        </Button>
        <Button type="primary" onClick={botHandler} shape="round" size="large">
          {!value ? <>Запустить бота</> : <> Остановить бота</>}
        </Button>
      </div>
    </div>
  );
}

export default BotPage;
