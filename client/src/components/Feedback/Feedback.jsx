import React from 'react';
import './Feedback.css';
import { Typography } from 'antd';

function Feedback() {
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
      </div>
    </div>
  );
}

export default Feedback;
