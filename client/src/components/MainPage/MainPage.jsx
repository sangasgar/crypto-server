import React, { useEffect, useState } from 'react';
import './MainPage.css';
import { Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import robot from '../../img/robot.png';

function MainPage() {
  const [sparkData, setSparkData] = useState([]);
  function randomData(num) {
    const arr = [];
    for (let i = 0; i < num; i += 1) {
      arr.push(Math.floor(Math.random() * 10) + 1);
    }
    return arr;
  }
  useEffect(() => {
    setSparkData(randomData(30));
  }, []);

  const { Text } = Typography;
  return (
    <div className="mainPage">
      <div className="intro">
        <h1>Neural Network</h1>
        <div className="page">
          <Text strong>
            Роботизировання торговая система для управления BTCUSDT.
            это автоматизированный роботизированный советник, который
            с помощью заложенных в него математических алгоритмов генерирует
            торговые сигналы в зависимости от текущей ситуации на рынке, средств
            трейдера, его пожеланий по стратегии инвестиционного поведения, уровням
            риска и предпочтений по секторам финансового рынка.
          </Text>
        </div>
        <img src={robot} alt="robot" width={160} />
        <Sparklines data={sparkData} limit={20}>
          <SparklinesLine color="#1c8cdc" />
          <SparklinesSpots />
        </Sparklines>
        <Button type="primary" className="singinButton" shape="round" size="large">
          <Link to="/singin">Вход</Link>
        </Button>
      </div>
    </div>
  );
}

export default MainPage;
