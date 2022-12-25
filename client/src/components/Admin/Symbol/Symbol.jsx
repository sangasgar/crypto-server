/* eslint-disable max-len */
import { Button, Input, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Symbol.css';
import SymbolItems from './SymbolItems/SymbolItems';

function Symbol() {
  const { Text } = Typography;
  const [input, setInput] = useState('');
  const [bdAlert, setBdAlert] = useState(false);
  const [deleteElement, setDeleteElement] = useState(false);
  const [positions, setPositions] = useState([]);
  useEffect(() => {
    axios.get('/positions').then((res) => {
      setPositions(res.data);
    });
  }, [bdAlert, deleteElement]);
  const clickHandler = async () => {
    const token = localStorage.getItem('token');
    const option = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const bd = await axios.post('/positions', { input }, option);
    setBdAlert(bd.data);
    setTimeout(() => {
      setBdAlert(false);
    }, 2000);
  };
  const inputHandler = (e) => {
    setInput(e.target.value);
  };
  return (
    <div className="symbol">
      <h1>Торговые пары</h1>
      {bdAlert ? <Text type="success">Торговая пара добавлена</Text> : null}
      {deleteElement ? <Text type="warning">Торговая пара удалена</Text> : null}
      <div className="page">
        <Input.Group compact>
          <Input
            onChange={inputHandler}
            value={input}
            name="symbol"
            style={{
              width: 'calc(100% - 100px)',
              alignItems: 'center',
            }}
          />
          <Button
            onClick={clickHandler}
            type="primary"
            style={{
              backgroundColor: 'black',
            }}
          >
            Добавить
          </Button>
        </Input.Group>
      </div>
      <div className="positionsList">
        {positions?.map((el) => (
          <SymbolItems symbol={el.symbol} deleteElement={deleteElement} setDeleteElement={setDeleteElement} id={el.id} key={el.id} />
        ))}
      </div>
    </div>
  );
}

export default Symbol;
