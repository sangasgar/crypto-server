import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Typography, Button } from 'antd';
import Bot from '../../../img/pngwing.png';
import BotPrint from '../../../img/botprint.png';
import './BotPage.css';

function BotPage() {
  const { Text } = Typography;
  const [value, setValue] = useState(false);
  const [symbol, setSymbol] = useState(false);
  const [sizeDeposit, setSizeDeposit] = useState(false);
  const [leverage, setLeverage] = useState(false);
  const [stoploss, setStoploss] = useState(false);
  const [save, setSave] = useState(false);
  useEffect(() => {
    axios.get('http://localhost:3010/users/bot-status-check').then((res) => setValue(res.data.botStatus));
    axios.get('http://localhost:3010/users/settings').then((res) => {
      setSymbol(res.data.symbol);
      setSizeDeposit(res.data.sizeDeposit);
      setLeverage(res.data.leverage);
      setStoploss(res.data.stoploss);
    });
  }, []);
  const botHandler = () => {
    axios.put('http://localhost:3010/users/bot-status', { botStatus: !value }).then((res) => setValue(res.data.botStatus));
  };
  const symbolChangeHandler = (e) => {
    setSymbol(e.target.value);
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
  const clickSymbolHandler = () => {
    axios.put('http://localhost:3010/users/settings', { symbol }).then((res) => {
      setSymbol(res.data.symbol);
      setSave(true);
      setTimeout(() => {
        setSave(false);
      }, 2000);
    });
  };
  const clickDepositChangeHandler = () => {
    axios.put('http://localhost:3010/users/settings', { sizeDeposit }).then((res) => {
      setSizeDeposit(res.data.sizeDeposit);
      setSave(true);
      setTimeout(() => {
        setSave(false);
      }, 3000);
    });
  };
  const clickLeverageHandler = () => {
    axios.put('http://localhost:3010/users/settings', { leverage }).then((res) => {
      setLeverage(res.data.leverage);
      setSave(true);
      setTimeout(() => {
        setSave(false);
      }, 3000);
    });
  };
  const clickStopLossHandler = () => {
    axios.put('http://localhost:3010/users/settings', { stoploss }).then((res) => {
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
        {symbol}
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
      <div className="name">
        Торговая пара:
        {!value
          ? (
            <select onChange={symbolChangeHandler} name="symbol">
              <option disabled>{symbol}</option>
              <option value="BTCUSDT">BTCUSDT</option>
              <option value="ETHUSDT">ETHUSDT</option>
            </select>
          ) : (
            <>
              {' '}
              {symbol}
            </>
          ) }
        {!value ? <button onClick={clickSymbolHandler} type="button">Сох.</button> : null}
      </div>
      <div className="name">
        Размер % стоимости ордера от депозита:
        {!value
          ? (
            <select onChange={sizeDepositChangeHandler} name="sizeDeposit">
              <option disabled>{sizeDeposit}</option>
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
            <select onChange={leverageChangeHandler} name="leverage">
              <option disabled>{leverage}</option>
              <option value="1">1x</option>
              <option value="3">3x</option>
              <option value="5">5x</option>
              <option value="10">10x</option>
              <option value="25">25x</option>
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
            <select name="stoploss" onChange={stoplossChangeHandler}>
              <option disabled>{stoploss}</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="25">25%</option>
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="95">95%</option>
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
