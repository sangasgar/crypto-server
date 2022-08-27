import React, { useState } from 'react';
import { Typography, Button } from 'antd';
import Bot from '../../../img/pngwing.png';
import './BotPage.css';

function BotPage() {
  const { Text } = Typography;
  const [value, setValue] = useState(false);
  const botHandler = () => {
    setValue(!value);
  };
  return (
    <div className="bot">
      <h1>Управление ботом</h1>
      <img src={Bot} alt="Бот" width={200} />
      {!value ? <Text className="botText" type="warning">Бот выключен </Text> : <Text className="botText" type="success">Бот запущен</Text>}
      <Button type="primary" onClick={botHandler} shape="round" size="large">
        {!value ? <>Запустить бота</> : <> Остановить бота</>}
      </Button>
    </div>
  );
}

export default BotPage;
