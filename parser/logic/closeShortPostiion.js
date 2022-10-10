/* eslint-disable max-len */
const cipherB = require('../indicators/cipherB');
const storage = require('../storage/storage');

async function closeShortPosition(id, client, symbol) {
  console.log(`Проверка на возможность закрытия позиции шорт ${symbol} для ${id}`);
  const period15Data = storage.getItem(`period15Data_${id}_${symbol}`);
  const period15DataCipherB = await cipherB(period15Data);
  const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
    time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i],
  }));
  period15DataCipherBwithTime.reverse();
  const vwapLast = Number(period15DataCipherBwithTime[1].vwap);
  const positioByBit = await client.getPosition({ symbol });
  const positionSize = Number(positioByBit.result[1].size);
  if (positionSize > 0) {
    if (vwapLast >= -5) {
      const closePosition = await client.placeActiveOrder({
        symbol, side: 'Buy', qty: positionSize, order_type: 'Market', close_on_trigger: false, reduce_only: true, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
      });
      if (closePosition.ret_msg === 'OK') {
        console.log(`Позиция шорт закрыта ${symbol} для ${id}`);
      } else {
        console.log(`Позиция шорт не закрыта ${symbol} для ${id}`);
      }
    }
  } else {
    console.log(`Открытых позиций шорт нет ${symbol} для ${id}`);
  }
}
module.exports = closeShortPosition;
