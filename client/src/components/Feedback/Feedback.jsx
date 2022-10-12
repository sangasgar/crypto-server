import React, { useEffect, useState } from 'react';
import './Feedback.css';
import { Typography } from 'antd';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import robot from '../../img/robot.png';

function Feedback() {
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
    <div className="feedback">
      <div className="intro">
        <h1>Обратная связь</h1>
        <Text>
          Если у Вас есть вопросы или предложения, просьба написать на почту
          {' '}
          <a href="mailto:info@gravitino.ru">info@gravitino.ru</a>
        </Text>
        <img src={robot} alt="robot" width={400} />
        <Sparklines data={sparkData} limit={20}>
          <SparklinesLine color="#1c8cdc" />
          <SparklinesSpots />
        </Sparklines>
      </div>
    </div>
  );
}

export default Feedback;
