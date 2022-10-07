/* eslint-disable react/prop-types */
import axios from 'axios';
import React from 'react';
import '../Symbol.css';

function SymbolItems({
  symbol, id, setDeleteElement,
}) {
  const clickDeleteHandler = () => {
    axios.post('/positions/delete', { id }).then((res) => {
      setDeleteElement(res.data);
      setTimeout(() => {
        setDeleteElement(false);
      }, 2000);
    });
  };
  return (
    <div className="element">
      {symbol }
      <button className="delete" onClick={clickDeleteHandler} type="button">Удал.</button>
    </div>
  );
}

export default SymbolItems;
