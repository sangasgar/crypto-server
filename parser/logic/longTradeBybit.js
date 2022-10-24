/* eslint-disable max-len */
const storage = require('../storage/storage');
const cipherB = require('../indicators/cipherB');
const chandeTrendScore = require('../indicators/chandeTrendScore');
const { Bots } = require('../db/models');

function longTrade(array) {
  array.reverse();
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  if (vwapLogic > 3.5 && vwapLogicLast < vwapLogic && mfLast < mf) {
    return true;
  }
  return false;
}
function crossowerLast(array) {
  for (let i = 1; i < 6; i += 1) {
    if (array[i].vwap <= 0) {
      return true;
    }
  }
  return false;
}
function longTrade1h(array) {
  array.reverse();
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  // const scoreCurrent = array[0].score;
  // const lastScore = array[1].score;
  if (vwapLogic > 3.5 && vwapLogicLast < vwapLogic && crossowerLast(array) && mfLast < mf) {
    return true;
  }
  return false;
}

function crossowerLast15m(array) {
  for (let i = 1; i < 4; i += 1) {
    if (array[i].vwap <= 0) {
      return true;
    }
  }
  return false;
}
function chandleTrend(array) {
  if ((array[1].score < array[0].score) || (array[1].score === -10 && array[0].score === -10)) {
    return true;
  }
  return false;
}
function bw2Func(array) {
  if (array[0].bw2 > -150 && array[0].bw2 < 40 && array[0].bw2 > array[1].bw2) {
    return true;
  }
  return false;
}
function longTrade15(array) {
  array.reverse();
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { bw1 } = array[0];
  const bw1Last = array[1].bw1;
  if (vwapLogic > 3.5 && vwapLogicLast < vwapLogic && bw1Last < bw1 && bw2Func(array) && crossowerLast15m(array) && chandleTrend(array)) {
    return true;
  }
  return false;
}

async function longTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit) {
  console.log('400');
  let getapikey = null;
  try {
    getapikey = await client.getApiKeyInfo();
  } catch (error) {
    console.log('Ошибка получения ключей');
  }
  console.log('401');
  try {
    if (getapikey.ret_msg === 'OK') {
      console.log('Ключи подтверждены');
      // Получение данных о балансе
      console.log('402');
      const balance = await client.getWalletBalance({ symbol });
      const balanceUSDT = Number(balance.result.USDT.available_balance);
      const longDeposit = (balanceUSDT * sizeDeposit) / 100;
      console.log('403');
      console.log(`Баланс id ${id} символ ${symbol}`, balanceUSDT);
      console.log(`Сумма позиции id ${id} символ ${symbol}`, longDeposit);
      const priceBybit = await client.getTickers({ symbol });
      // Получение данных о последней цене
      const lastPrice = Number(priceBybit.result[0].last_price);
      console.log(`Последняя цена  id ${id} символ ${symbol}`, lastPrice);
      // Количество покупаемого актива
      const countActive = (longDeposit / lastPrice).toFixed(2);
      console.log(`Количество актива_${id}_${symbol}`, countActive);
      const stopLossCount = (stoploss * longDeposit) / 100;
      // Расчет стоп-лоса
      const stopLossTrade = lastPrice - (((stopLossCount * lastPrice) / (longDeposit * leverage)) / 2).toFixed(2);
      console.log(`Стоп лосс id ${id} символ ${symbol}`, stopLossTrade);
      console.log('403');
      const period6hData = storage.getItem(`period6hData_${id}_${symbol}`);
      const period6hDataCipherB = await cipherB(period6hData);
      const period6hDataChandeTrendScore = await chandeTrendScore(period6hData);
      const period6hDataCipherBwithTime = await period6hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period6hDataCipherB[0][i], bw2: period6hDataCipherB[1][i], vwap: period6hDataCipherB[2][i], mf: period6hDataCipherB[3][i], score: period6hDataChandeTrendScore[i],
      }));
      console.log('404');
      const period6Hresult = await longTrade(period6hDataCipherBwithTime);
      await storage.addItem(`period6hLongBoolean_${id}_${symbol}`, period6Hresult);
      const time6h = Number(period6hDataCipherBwithTime[period6hDataCipherBwithTime.length - 1].time);
      const milliseconds6h = time6h * 1000;
      const dateObject6h = new Date(milliseconds6h);
      const humanDateFormat6h = dateObject6h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat6h);
      console.log(`Проверка входа на 6 часов для id ${id}`, storage.getItem(`period6hLongBoolean_${id}_${symbol}`));
      console.log('405');
      const period2hData = storage.getItem(`period2hData_${id}_${symbol}`);
      const period2hDataCipherB = await cipherB(period2hData);
      const period2hDataChandeTrendScore = await chandeTrendScore(period2hData);
      const period2hDataCipherBwithTime = await period2hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period2hDataCipherB[0][i], bw2: period2hDataCipherB[1][i], vwap: period2hDataCipherB[2][i], mf: period2hDataCipherB[3][i], score: period2hDataChandeTrendScore[i],
      }));
      console.log('406');
      const period2Hresult = await longTrade(period2hDataCipherBwithTime);
      await storage.addItem(`period2hLongBoolean_${id}_${symbol}`, period2Hresult);
      const time2h = Number(period2hDataCipherBwithTime[period2hDataCipherBwithTime.length - 1].time);
      const milliseconds2h = time2h * 1000;
      const dateObject2h = new Date(milliseconds2h);
      const humanDateFormat2h = dateObject2h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat2h);
      console.log(`Проверка входа на 2 часов для id ${id}`, storage.getItem(`period2hLongBoolean_${id}_${symbol}`));
      const period1hData = storage.getItem(`period1hData_${id}_${symbol}`);
      const period1hDataCipherB = await cipherB(period1hData);
      const period1hDataChandeTrendScore = await chandeTrendScore(period1hData);
      const period1hDataCipherBwithTime = await period1hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period1hDataCipherB[0][i], bw2: period1hDataCipherB[1][i], vwap: period1hDataCipherB[2][i], mf: period1hDataCipherB[3][i], score: period1hDataChandeTrendScore[i],
      }));
      console.log('407');
      const period1Hresult = await longTrade1h(period1hDataCipherBwithTime);
      await storage.addItem(`period1hLongBoolean_${id}_${symbol}`, period1Hresult);
      const time1h = Number(period1hDataCipherBwithTime[period1hDataCipherBwithTime.length - 1].time);
      const milliseconds1h = time1h * 1000;
      const dateObject1h = new Date(milliseconds1h);
      const humanDateFormat1h = dateObject1h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat1h);
      console.log(`Проверка входа на 1 час для id ${id}`, storage.getItem(`period1hLongBoolean_${id}_${symbol}`));
      const period15Data = storage.getItem(`period15Data_${id}_${symbol}`);
      const period15DataCipherB = await cipherB(period15Data);
      const period15DataChandeTrendScore = await chandeTrendScore(period15Data);
      const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i], mf: period15DataCipherB[3][i], score: period15DataChandeTrendScore[i],
      }));
      console.log('408');
      console.log('Символ', symbol);
      const period15result = await longTrade15(period15DataCipherBwithTime);
      await storage.addItem(`period15LongBoolean_${id}_${symbol}`, period15result);
      const time15 = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 1].time);
      const milliseconds15 = time15 * 1000;
      const dateObject15 = new Date(milliseconds15);
      const humanDateFormat15 = dateObject15.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat15);
      console.log('409');
      console.log(`Проверка входа на 15 минут для id ${id}`, storage.getItem(`period15LongBoolean_${id}_${symbol}`));
      const Long6hBoolean = storage.getItem(`period6hLongBoolean_${id}_${symbol}`);
      const Long2hBoolean = storage.getItem(`period2hLongBoolean_${id}_${symbol}`);
      const Long1hBoolean = storage.getItem(`period1hLongBoolean_${id}_${symbol}`);
      const Long15Boolean = storage.getItem(`period15LongBoolean_${id}_${symbol}`);
      if ((Long6hBoolean && Long1hBoolean && Long15Boolean) || (Long2hBoolean && Long1hBoolean && Long15Boolean)) {
        console.log(`Проверка возможности входа в позицию для id ${id}`);
        await client.setMarginSwitch({
          symbol, buy_leverage: leverage, sell_leverage: leverage, is_isolated: false,
        });
        const isIsolated = await client.setMarginSwitch({
          symbol, buy_leverage: leverage, sell_leverage: leverage, is_isolated: true,
        });
        if (isIsolated.ret_msg === 'OK') {
          const longPosition = await client.placeActiveOrder({
            symbol, side: 'Buy', qty: countActive, order_type: 'Market', close_on_trigger: false, reduce_only: false, stop_loss: stopLossTrade, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
          });
          console.log(longPosition);
          if (longPosition.ret_msg === 'OK') {
            console.log(`Позиция лонг открыта для id ${id}`);
            await storage.addItem(`positionEnter_${id}`, true);
          }
        }
      }
    } else {
      console.log(`Ошибка верификации ключей на бирже для id ${id}`);
    }
  } catch (error) {
    console.log(`Ошибка соединения  для id ${id}`);
  }
}
module.exports = longTradeBybit;
