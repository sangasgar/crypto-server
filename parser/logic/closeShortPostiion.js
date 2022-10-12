/* eslint-disable max-len */
const cipherB = require('../indicators/cipherB');
const storage = require('../storage/storage');
const { Bots } = require('../db/models');

async function closeShortPosition(id, client, symbol) {
  try {
    console.log(`Проверка на возможность закрытия позиции шорт ${symbol} для ${id}`);
    const period15Data = storage.getItem(`period15Data_${id}_${symbol}`);
    const period15DataCipherB = await cipherB(period15Data);
    const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
      time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i],
    }));
    period15DataCipherBwithTime.reverse();
    const vwapLast = Number(period15DataCipherBwithTime[1].vwap);
    const vwapMin = Math.min(period15DataCipherBwithTime[1].vwap, period15DataCipherBwithTime[2].vwap, period15DataCipherBwithTime[3].vwap, period15DataCipherBwithTime[4].vwap);
    const currentVwap = period15DataCipherBwithTime[0].vwap;
    let currentVwap95Change = false;
    if (currentVwap >= vwapMin - (vwapMin * 0.95)) {
      currentVwap95Change = true;
    }
    const positioByBit = await client.getPosition({ symbol });
    const positionSize = Number(positioByBit.result[1].size);
    if (positionSize > 0) {
      console.log(`Проверка на возможность закрытия позиции шорт ${symbol} для ${id}`);
      if (vwapLast >= -3.5 || currentVwap95Change) {
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
  } catch (error) {
    console.log(`Ошибка соединения  для id ${id}`);
    await Bots.update({ botStatus: false }, { where: { user_id: id } });
  }
}
module.exports = closeShortPosition;
