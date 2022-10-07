/* eslint-disable max-len */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Typography, Button, Checkbox, Row,
} from 'antd';
import Bot from '../../../img/pngwing.png';
import BotPrint from '../../../img/botprint.png';
import './BotPage.css';
import Positions from './Positions/Positions';

function BotPage() {
  const { user } = useSelector((state) => state);
  const { Text } = Typography;
  const [value, setValue] = useState(false);
  const [symbol, setSymbol] = useState([]);
  const [positions, setPositions] = useState([]);
  const [sizeDeposit, setSizeDeposit] = useState(false);
  const [leverage, setLeverage] = useState(false);
  const [stoploss, setStoploss] = useState(false);
  const [save, setSave] = useState(false);
  const [update, setUpdate] = useState(false);
  let symbolArray = [];

  useEffect(() => {
    axios.post('/users/bot-status-check', { id: user.id }).then((res) => setValue(res.data.botStatus));
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
  const botHandler = () => {
    axios.put('/users/bot-status', { id: user.id, botStatus: !value }).then((res) => setValue(res.data.botStatus));
  };
  const sizeDepositChangeHandler = (e) => {
    setSizeDeposit(e.target.value);
  };
  const leverageChangeHandler = (e) => {
    setLeverage(e.target.value);
  };
  const stoplossChangeHandler = (e) => {
    setStoploss(e.target.value);
  };
  const onChange = (checkedValues) => {
    symbolArray = checkedValues.map((el) => ({ symbolId: el }));
  };
  const clickSymbolHandler = () => {
    axios.put('/users/settings', { symbols: symbolArray, id: user.id }).then((res) => {
      setUpdate(res.data);
      setSave(true);
      setTimeout(() => {
        setSave(false);
      }, 2000);
    });
  };
  const clickDepositChangeHandler = () => {
    axios.put('/users/settings', { sizeDeposit, id: user.id }).then((res) => {
      setSizeDeposit(res.data.sizeDeposit);
      setSave(true);
      setTimeout(() => {
        setSave(false);
      }, 3000);
    });
  };
  const clickLeverageHandler = () => {
    axios.put('/users/settings', { leverage, id: user.id }).then((res) => {
      setLeverage(res.data.leverage);
      setSave(true);
      setTimeout(() => {
        setSave(false);
      }, 3000);
    });
  };
  const clickStopLossHandler = () => {
    axios.put('/users/settings', { stoploss, id: user.id }).then((res) => {
      setStoploss(res.data.stoploss);
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
        {!value ? <button onClick={clickSymbolHandler} type="button">Сох.</button> : null}
      </div>
      <div className="name">
        Размер % стоимости ордера от депозита:
        {!value
          ? (
            <select onClick={sizeDepositChangeHandler} name="sizeDeposit">
              <option disabled>{sizeDeposit}</option>
              <option value={sizeDeposit}>---</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="35">35</option>
              <option value="40">40</option>
              <option value="45">45</option>
              <option value="50">50</option>
              <option value="75">75</option>
              <option value="100">100</option>
            </select>
          ) : (
            <>
              {' '}
              {sizeDeposit}
              %
            </>
          ) }
        {!value ? <button onClick={clickDepositChangeHandler} type="button">Сох.</button> : null}
      </div>
      <div className="name">
        Кредитное плечо:
        {!value
          ? (
            <select onClick={leverageChangeHandler} name="leverage">
              <option disabled>{leverage}</option>
              <option value={leverage}>---</option>
              <option value="1">1x</option>
              <option value="3">3x</option>
              <option value="5">5x</option>
              <option value="10">10x</option>
              <option value="15">15x</option>
              <option value="20">20x</option>
              <option value="25">25x</option>
              <option value="30">30x</option>
              <option value="35">35x</option>
              <option value="40">40x</option>
              <option value="45">45x</option>
              <option value="50">50x</option>
              <option value="100">100x</option>
            </select>
          ) : (
            <>
              {' '}
              {leverage}
              x
            </>
          ) }
        {!value ? <button onClick={clickLeverageHandler} type="button">Сох.</button> : null}
      </div>
      <div className="name">
        Размер % стоп-лоса от стоимости:
        {!value
          ? (
            <select name="stoploss" onClick={stoplossChangeHandler}>
              <option disabled>{stoploss}</option>
              <option value={stoploss}>---</option>
              <option value="1">1x</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="15">15%</option>
              <option value="20">20%</option>
              <option value="25">25%</option>
              <option value="30">30%</option>
              <option value="35">35%</option>
              <option value="40">40%</option>
              <option value="45">45%</option>
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="95">95%</option>
              <option value="100">100x</option>
            </select>
          ) : (
            <>
              {' '}
              {stoploss}
              %
            </>
          ) }
        {!value ? <button onClick={clickStopLossHandler} type="button">Сох.</button> : null}
      </div>
      {!value ? <img src={Bot} alt="Бот" width={200} /> : <img src={BotPrint} alt="Бот" width={200} />}
      {!value ? <Text className="botText" type="warning">Бот выключен </Text> : <Text className="botText" type="success">Бот запущен</Text>}
      <Button type="primary" onClick={botHandler} shape="round" size="large">
        {!value ? <>Запустить бота</> : <> Остановить бота</>}
      </Button>
    </div>
  );
}

export default BotPage;
