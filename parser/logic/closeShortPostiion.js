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

async function closeShortPosition(id, client, symbol) {
  try {
    await fs.appendFile('logs.txt', `Проверка на возможность закрытия позиции шорт ${symbol} для ${id}\n`);
    console.log(`Проверка на возможность закрытия позиции шорт ${symbol} для ${id}`);
    const period15Data = storage.getItem(`period15Data_${id}_${symbol}`);
    const period15DataCipherB = await cipherB(period15Data);
    const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
      time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i], mf: period15DataCipherB[3][i],
    }));
    const arrayShort = period15DataCipherBwithTime.reverse();
    const vwapLast = Number(arrayShort[1].vwap);
    const vwapCurrent = Number(arrayShort[0].vwap);
    const lastTime = Number(arrayShort[0].time);
    const arrayTimes = storage.getItem(`arrayTime_${id}`);
    await fs.appendFile('logs.txt', `Шорт массив ${JSON.stringify(arrayTimes)}\n`);
    await fs.appendFile('logs.txt', `Последнее время ${lastTime}\n`);
    await fs.appendFile('logs.txt', `Вивап ${symbol} для ${id} ${vwapCurrent}\n`);
    await fs.appendFile('logs.txt', `Вивап ласт ${symbol} для ${id} ${vwapLast}\n`);
    await fs.appendFile('logs.txt', `checkTimes ${checkTimes(arrayTimes, lastTime)}\n`);
    console.log('Шорт массив', arrayTimes);
    console.log('Последнее время ', lastTime);
    console.log('Вивап ', vwapCurrent);
    console.log('Вивап ласт', vwapLast);
    console.log(checkTimes(arrayTimes, lastTime));
    const timeCheck = checkTimes(arrayTimes, lastTime);
    console.log('массив ', timeCheck);
    console.log('Проверка времени шорт ', timeCheck);
    await fs.appendFile('logs.txt', `массив ${arrayTimes}\n`);
    await fs.appendFile('logs.txt', `Проверка времени шорт ${timeCheck}\n`);
    // const vwapMin = Math.min(period15DataCipherBwithTime[1].vwap, period15DataCipherBwithTime[2].vwap, period15DataCipherBwithTime[3].vwap, period15DataCipherBwithTime[4].vwap);
    // const currentVwap = period15DataCipherBwithTime[0].vwap;
    // const currentVwap95Change = false;
    // if (currentVwap >= vwapMin - (vwapMin * 0.95)) {
    //   currentVwap95Change = true;
    // }
    let positioByBit = null;
    let positionSize = null;
    try {
      positioByBit = await client.getPosition({ symbol });
      positionSize = Number(positioByBit.result[1].size);
      console.log('Шорт размер', positionSize);
      await fs.appendFile('logs.txt', `Шорт размер ${positionSize}\n`);
    } catch (error) {
      console.log('Ошибка получения данных о позиции');
    }
    // Получение данных о последней цене
    if (positionSize > 0) {
      console.log(`Проверка на возможность закрытия позиции шорт ${symbol} для ${id}`);
      await fs.appendFile('logs.txt', `Проверка на возможность закрытия позиции шорт ${symbol} для ${id}\n`);
      if (vwapCurrent >= -1.5 && vwapLast >= -1.5 && timeCheck === false) {
        const closePosition = await client.placeActiveOrder({
          symbol, side: 'Buy', qty: positionSize, order_type: 'Market', close_on_trigger: false, reduce_only: true, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
        });
        await fs.appendFile('logs.txt', `Информация о закрытии позиции шорт $${JSON.stringify(closePosition)}\n`);
        if (closePosition.ret_msg === 'OK') {
          console.log(`Позиция шорт закрыта ${symbol} для ${id}`);
          await fs.appendFile('logs.txt', `Позиция шорт закрыта ${symbol} для ${id}\n`);
          await storage.addItem(`positionEnter_${id}`, false);
        } else {
          console.log(`Позиция шорт не закрыта ${symbol} для ${id}`);
          await fs.appendFile('logs.txt', `Позиция шорт не закрыта ${symbol} для ${id}\n`);
        }
      }
    } else {
      console.log(`Открытых позиций шорт нет ${symbol} для ${id}`);
      await fs.appendFile('logs.txt', `Открытых позиций шорт нет ${symbol} для ${id}\n`);
    }
  } catch (error) {
    console.log(`Ошибка соединения  для id ${id}`);
    await fs.appendFile('logs.txt', `Ошибка соединения  для id ${id}\n`);
  }
}
module.exports = closeShortPosition;
