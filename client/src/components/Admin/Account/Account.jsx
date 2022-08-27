import React from 'react';
import { useSelector } from 'react-redux';
import './Account.css';

function Account() {
  const { user } = useSelector((state) => state);
  return (
    <div className="account">
      <h1>Мой аккаунт</h1>
      <h1>
        Привет
        {' '}
        {user.name}
      </h1>
      <h1>
        Почта
        {' '}
        {user.email}
      </h1>
      <h1>
        Токен защиты
      </h1>
      {localStorage.getItem('token')}
    </div>
  );
}

export default Account;
