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
  useEffect(() => {
    axios.get('http://localhost:3010/users/bot-status-check').then((res) => setValue(res.data.botStatus));
  }, []);
  const botHandler = () => {
    axios.put('http://localhost:3010/users/bot-status', { botStatus: !value }).then((res) => setValue(res.data.botStatus));
  };
  return (
    <div className="bot">
      <h1>Управление ботом</h1>
      <div className="name">
        Торговая пара:
        {symbol ? <input type="text" size="14" /> : (
          <select name="symbol">
            <option disabled>BTCUSDT</option>
            <option value="BTCUSDT">BTCUSDT</option>
            <option value="ETHUSDT">ETHUSDT</option>
          </select>
        )}
        <button type="button">Сох.</button>
      </div>
      <div className="name">
        Размер % стоимости ордера от депозита
        {symbol ? <input type="text" size="14" /> : (
          <select name="symbol">
            <option disabled>10</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
          </select>
        )}
        <button type="button">Сох.</button>
      </div>
      <div className="name">
        Кредитное плечо
        {symbol ? <input type="text" size="14" /> : (
          <select name="symbol">
            <option disabled>1x</option>
            <option value="1">1x</option>
            <option value="3">3x</option>
            <option value="5">5x</option>
            <option value="10">10x</option>
            <option value="25">25x</option>
            <option value="50">50x</option>
            <option value="100">100x</option>
          </select>
        )}
        <button type="button">Сох.</button>
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
