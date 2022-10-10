/* eslint-disable max-len */
const cipherB = require('../indicators/cipherB');
const storage = require('../storage/storage');

async function closeLongPosition(id, client, symbol) {
  console.log(`Проверка на возможность закрытия позиции лонг ${symbol} для ${id}`);
  const period15Data = storage.getItem(`period15Data_${id}_${symbol}`);
  const period15DataCipherB = await cipherB(period15Data);
  const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
    time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i],
  }));
  period15DataCipherBwithTime.reverse();
  const vwapLast = Number(period15DataCipherBwithTime[1].vwap);
  const vwapMax = Math.max(period15DataCipherBwithTime[1].vwap, period15DataCipherBwithTime[2].vwap, period15DataCipherBwithTime[3].vwap, period15DataCipherBwithTime[4].vwap);
  const currentVwap = period15DataCipherBwithTime[0].vwap;
  let currentVwap30Change = false;
  if (currentVwap < vwapMax - (vwapMax * 0.3)) {
    currentVwap30Change = true;
  }
  const positioByBit = await client.getPosition({ symbol });
  const positionSize = Number(positioByBit.result[0].size);
  if (positionSize > 0) {
    if (vwapLast <= 3.5 || currentVwap30Change) {
      const closePosition = await client.placeActiveOrder({
        symbol, side: 'Sell', qty: positionSize, order_type: 'Market', close_on_trigger: false, reduce_only: true, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
      });
      if (closePosition.ret_msg === 'OK') {
        console.log(`Позиция лонг закрыта ${symbol} для ${id}`);
      } else {
        console.log(`Позиция лонг не закрыта ${symbol} для ${id}`);
      }
    }
  } else {
    console.log(`Открытых позиций лонг нет ${symbol} для ${id}`);
  }
}
module.exports = closeLongPosition;