const fs = require('fs').promises;
/* eslint-disable max-len */
const cipherB = require('../indicators/cipherB');
const storage = require('../storage/storage');

const checkTimes = (array, currentTime) => {
  try {
    let checkBoolean = false;
    if (array !== null || array !== undefined) {
      for (let i = 0; i < array.length; i += 1) {
        if (array[i] === currentTime) {
          checkBoolean = true;
          console.log('Проверка времени', checkBoolean);
        }
      }
    }
    return checkBoolean;
  } catch (error) {
    return false;
  }
};
async function closeLongPosition(id, client, symbol) {
  try {
    await fs.appendFile('logs.txt', `Проверка на возможность закрытия позиции лонг ${symbol} для ${id}\n`);
    console.log(`Проверка на возможность закрытия позиции лонг ${symbol} для ${id}`);
    const period15Data = storage.getItem(`period15Data_${id}_${symbol}`);
    const period15DataCipherB = await cipherB(period15Data);
    const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
      time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i], mf: period15DataCipherB[3][i],
    }));
    period15DataCipherBwithTime.reverse();
    const vwapLast = Number(period15DataCipherBwithTime[1].vwap);
    const vwapCurrent = Number(period15DataCipherBwithTime[0].vwap);
    const lastTime = Number(period15DataCipherBwithTime[1].time);
    const arrayTimes = storage.getItem(`arrayTime_${id}`);
    await fs.appendFile('logs.txt', `Последнее время ${lastTime}\n`);
    console.log('Последнее время ', lastTime);
    await fs.appendFile('logs.txt', `Вивап ${vwapLast}\n`);
    console.log('Вивап ', vwapLast);
    console.log(checkTimes(arrayTimes, lastTime));
    const timeCheck = checkTimes(arrayTimes, lastTime);
    await fs.appendFile('logs.txt', `arrayTimes ${arrayTimes}\n`);
    console.log('массив ', arrayTimes);
    const openCurrent = Number(period15DataCipherBwithTime[0].open);
    // const vwapMax = Math.max(period15DataCipherBwithTime[1].vwap, period15DataCipherBwithTime[2].vwap, period15DataCipherBwithTime[3].vwap, period15DataCipherBwithTime[4].vwap);
    // const currentVwap = period15DataCipherBwithTime[0].vwap;
    // let currentVwap95Change = false;
    // if (currentVwap <= vwapMax - (vwapMax * 0.95)) {
    //   currentVwap95Change = true;
    // }
    let positioByBit = null;
    let positionSize = null;
    let priceBybit = null;
    try {
      positioByBit = await client.getPosition({ symbol });
      positionSize = Number(positioByBit.result[0].size);
      priceBybit = await client.getTickers({ symbol });
    } catch (error) {
      console.log('Ошибка получения данных о позиции');
    }
    // Получение данных о последней цене
    const lastPrice = Number(priceBybit.result[0].last_price);
    if (positionSize > 0) {
      console.log(`Проверка на возможность закрытия позиции лонг ${symbol} для ${id}`);
      if (vwapCurrent <= 1.5 && vwapLast <= 1.5 && timeCheck === false) {
        const closePosition = await client.placeActiveOrder({
          symbol, side: 'Sell', qty: positionSize, order_type: 'Market', close_on_trigger: false, reduce_only: true, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
        });
        if (closePosition.ret_msg === 'OK') {
          console.log(`Позиция лонг закрыта ${symbol} для ${id}`);
          await storage.addItem(`positionEnter_${id}`, false);
        } else {
          console.log(`Позиция лонг не закрыта ${symbol} для ${id}`);
        }
      }
    } else {
      console.log(`Открытых позиций лонг нет ${symbol} для ${id}`);
    }
  } catch (error) {
    console.log(`Ошибка соединения  для id ${id}`);
  }
}
module.exports = closeLongPosition;
