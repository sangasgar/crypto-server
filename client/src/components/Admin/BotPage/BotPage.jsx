import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Typography, Button } from 'antd';
import Bot from '../../../img/pngwing.png';
import BotPrint from '../../../img/botprint.png';
import './BotPage.css';

function BotPage() {
  const { Text } = Typography;
  const [value, setValue] = useState(false);
  useEffect(() => {
    axios.get('http://localhost:3010/users/bot-status-check').then((res) => setValue(res.data.botStatus));
  }, []);
  const botHandler = () => {
    axios.put('http://localhost:3010/users/bot-status', { botStatus: !value }).then((res) => setValue(res.data.botStatus));
  };
  return (
    <div className="bot">
      <h1>Управление ботом</h1>
      {!value ? <img src={Bot} alt="Бот" width={200} /> : <img src={BotPrint} alt="Бот" width={200} />}
      {!value ? <Text className="botText" type="warning">Бот выключен </Text> : <Text className="botText" type="success">Бот запущен</Text>}
      <Button type="primary" onClick={botHandler} shape="round" size="large">
        {!value ? <>Запустить бота</> : <> Остановить бота</>}
      </Button>
    </div>
  );
}

export default BotPage;
