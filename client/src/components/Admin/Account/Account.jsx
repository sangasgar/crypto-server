/* eslint-disable max-len */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUser } from '../../../Redux/Actions/userAction';
import './Account.css';

function Account() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const [name, setName] = useState(false);
  const [email, setEmail] = useState(false);
  const [publicKey, setPublicKey] = useState(false);
  const [privateKey, setPrivateKey] = useState(false);
  const [password, setPassword] = useState(false);
  const [input, setInput] = useState(user.name);
  const [inputEmail, setInputEmail] = useState(user.email);
  const [inputPublicKey, setInputPublicKey] = useState(user.publicKey);
  const [inputPrivateKey, setInputPrivateKey] = useState(user.privateKey);
  const [inputPassword, setInputPassword] = useState('');
  const clickHandler = () => {
    setName(!name);
  };
  const saveClickHandler = () => {
    dispatch(editUser({
      name: input, email: inputEmail, publicKey: inputPublicKey, privateKey: inputPrivateKey, password: inputPassword,
    }));
    setName(!name);
  };
  const emailHandler = () => {
    setEmail(!email);
  };
  const saveEmailHandler = () => {
    dispatch(editUser({
      name: input, email: inputEmail, publicKey: inputPublicKey, privateKey: inputPrivateKey, password: inputPassword,
    }));
    setEmail(!email);
  };
  const publicKeyHandler = () => {
    setPublicKey(!publicKey);
  };
  const savePublicKeHandler = () => {
    dispatch(editUser({
      name: input, email: inputEmail, publicKey: inputPublicKey, privateKey: inputPrivateKey, password: inputPassword,
    }));
    setPublicKey(!publicKey);
  };
  const privateKeyHandler = () => {
    setPrivateKey(!privateKey);
  };
  const savePrivateKeHandler = () => {
    dispatch(editUser({
      name: input, email: inputEmail, publicKey: inputPublicKey, privateKey: inputPrivateKey, password: inputPassword,
    }));
    setPrivateKey(!privateKey);
  };
  const passwordHandler = () => {
    setPassword(!password);
  };
  const savePasswordHandler = () => {
    dispatch(editUser({
      name: input, email: inputEmail, publicKey: inputPublicKey, privateKey: inputPrivateKey, password: inputPassword,
    }));
    setPassword(!password);
  };
  const inputHandler = (e) => {
    setInput(e.target.value);
  };
  const inputEmailHandler = (e) => {
    setInputEmail(e.target.value);
  };
  const publicKeyValueHandler = (e) => {
    setInputPublicKey(e.target.value);
  };
  const privateKeyValueHandler = (e) => {
    setInputPrivateKey(e.target.value);
  };
  const passwordValueHandler = (e) => {
    setInputPassword(e.target.value);
  };
  return (
    <div className="account">
      <h1>Мой аккаунт</h1>
      <div className="name">
        Имя:
        {' '}
        {name ? <input type="text" onChange={inputHandler} value={input} size="14" /> : user.name}
        {' '}
        {name ? (
          <>
            <button onClick={saveClickHandler} type="button">Сох.</button>
            <button onClick={clickHandler} type="button">X</button>
          </>
        ) : (
          <button onClick={clickHandler} type="button">Ред.</button>
        ) }

      </div>

      <div className="name">
        Почта:
        {' '}
        {email ? <input type="text" onChange={inputEmailHandler} value={inputEmail} size="14" /> : user.email}
        {' '}
        {email ? (
          <>
            <button onClick={saveEmailHandler} type="button">Сох.</button>
            <button onClick={emailHandler} type="button">X</button>
          </>
        ) : (
          <button onClick={emailHandler} type="button">Ред.</button>
        ) }

      </div>
      <div className="name">
        Публичный ключ:
        {' '}
        {publicKey ? <input type="text" onChange={publicKeyValueHandler} value={inputPublicKey} size="14" /> : '**********'}
        {' '}
        {publicKey ? (
          <>
            <button onClick={savePublicKeHandler} type="button">Сох.</button>
            <button onClick={publicKeyHandler} type="button">X</button>
          </>
        ) : (
          <button onClick={publicKeyHandler} type="button">Ред.</button>
        ) }

      </div>
      <div className="name">
        Приватный ключ:
        {' '}
        {privateKey ? <input type="text" onChange={privateKeyValueHandler} value={inputPrivateKey} size="14" /> : '**********'}
        {' '}
        {privateKey ? (
          <>
            <button onClick={savePrivateKeHandler} type="button">Сох.</button>
            <button onClick={privateKeyHandler} type="button">X</button>
          </>
        ) : (
          <button onClick={privateKeyHandler} type="button">Ред.</button>
        ) }
      </div>
      <div className="name">
        Пароль:
        {' '}
        {password ? <input type="text" onChange={passwordValueHandler} value={inputPassword} size="14" /> : '**********'}
        {' '}
        {password ? (
          <>
            <button onClick={savePasswordHandler} type="button">Сох.</button>
            <button onClick={passwordHandler} type="button">X</button>
          </>
        ) : (
          <button onClick={passwordHandler} type="button">Изменить.</button>
        ) }

      </div>
      <h1>
        Токен защиты
      </h1>
      {localStorage.getItem('token')}
    </div>
  );
}

export default Account;
