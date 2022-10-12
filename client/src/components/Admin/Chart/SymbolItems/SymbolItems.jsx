/* eslint-disable react/prop-types */
import React from 'react';

function SymbolItems({ positions }) {
  return (
    <>
      {positions.map((el) => <option value={el.symbol}>{el.symbol}</option>)}
    </>
  );
}

export default SymbolItems;
