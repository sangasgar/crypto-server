/* eslint-disable max-len */

const storage = require('../storage/storage');
const cipherB = require('../indicators/cipherB');
const chandeTrendScore = require('../indicators/chandeTrendScore');

const searchLastTime = (array, id) => {
  array.reverse();
  const arrayTime = [];
  for (let i = 0; i < array.length - 1; i += 1) {
    arrayTime.push(array[i].time);
  }
  storage.addItem(`arrayTime_${id}`, arrayTime);
  return arrayTime;
};

// async function lastPriceFunc(object) {
//   // const priceBybit = await client.getTickers({ symbol });
//   // console.log(priceBybit);
//   // Получение данных о последней цене
//   // const lastPrice = Number(priceBybit.result[0].last_price);
//   const result = HeikinAshi([{
//     time: object.time,
//     close: object.close,
//     high: object.high,
//     low: object.low,
//     open: object.open,
//     volume: object.volume,
//   }], {
//     overWrite: false, // overwrites the original data or create a new array
//     formatNumbers: false, // formats the numbers and reduces their significant digits based on the values
//     decimals: 4, // number of significant digits
//     forceExactDecimals: false, // force the number of significant digits or reduce them if the number is high
//   });
//   return result[0].close;
// }
async function longTrade6h(array) {
  array.reverse();
  const { mf } = array[0];
  const moneyflowLast = array[1].mf;
  const openPrice = array[0].open;
  const lastPrice = array[0].close;
  const vwapLogic = array[0].vwap;
  // const vwapLogicLast = array[1].vwap;
  if (vwapLogic >= 3.5 && moneyflowLast < mf && openPrice < lastPrice) {
    return true;
  }
  return false;
}
async function longTrade2h(array) {
  array.reverse();
  const lastPrice = array[0].close;
  const openPrice = array[0].open;
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  if (vwapLogic >= 3.5 && openPrice < lastPrice && (vwapLogicLast < vwapLogic || mfLast < mf)) {
    return true;
  }
  return false;
}
function chandleTrendMfiVwapComparison(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent) {
  if ((vwapLogicLast < vwapLogic || mfLast < mf) && (lastScore < scoreCurrent || (lastScore === 10 && scoreCurrent === 10))) {
    return true;
  }
  return false;
}
async function longTrade1h(array) {
  array.reverse();
  const lastPrice = array[0].close;
  const openPrice = array[0].open;
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  const scoreCurrent = array[0].score;
  const lastScore = array[1].score;
  if (vwapLogic >= 3.5 && openPrice < lastPrice && chandleTrendMfiVwapComparison(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent)) {
    return true;
  }
  return false;
}

function crossowerLast15m(array) {
  for (let i = 1; i < 6; i += 1) {
    if (array[i].vwap <= 0) {
      return true;
    }
  }
  return false;
}
function chandleTrendMfiVwapComparison15m(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent) {
  if ((vwapLogicLast < vwapLogic || mfLast < mf) && (lastScore < scoreCurrent || (lastScore === 10 && scoreCurrent === 10))) {
    return true;
  }
  return false;
}
function bw2Func(bw2last, bw2Current) {
  if (bw2Current > -150 && bw2Current < 50 && bw2Current > bw2last) {
    return true;
  }
  return false;
}
async function longTrade15Last(array) {
  array.reverse();
  console.log('Предыдущие 15 минут', array[1].time);
  const vwapLogic = array[1].vwap;
  const lastPrice = array[1].close;
  const openPrice = array[1].open;
  const vwapLogicLast = array[2].vwap;
  const { mf } = array[1];
  const mfLast = array[2].mf;
  const scoreCurrent = array[1].score;
  const lastScore = array[2].score;
  const bw2Current = array[1].bw2;
  const bw2last = array[2].bw2;
  console.log('Время', array[1].time);
  console.log('Последняя цена', lastPrice);
  console.log('Цена открытия', openPrice);
  console.log('вивап цена', vwapLogic);
  console.log('вивап предыдущая цена', vwapLogicLast);
  console.log('мф цена', mf);
  console.log('мф предыдущая цена', mfLast);
  console.log('scoreCurrent цена', scoreCurrent);
  console.log('lastScore предыдущая цена', lastScore);
  if (vwapLogic >= 2 && openPrice < lastPrice && bw2Func(bw2last, bw2Current) && chandleTrendMfiVwapComparison15m(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent)) {
    return true;
  }
  return false;
}

async function longTrade15(array) {
  array.reverse();
  const vwapLogic = array[0].vwap;
  const lastPrice = array[0].close;
  const openPrice = array[0].open;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  const scoreCurrent = array[0].score;
  const lastScore = array[1].score;
  const bw2Current = array[0].bw2;
  const bw2last = array[1].bw2;
  if (vwapLogic >= 2 && openPrice < lastPrice && bw2Func(bw2last, bw2Current) && crossowerLast15m(array) && chandleTrendMfiVwapComparison15m(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent)) {
    return true;
  }
  return false;
}

function crossowerLast5m(array) {
  for (let i = 1; i < 4; i += 1) {
    if (array[i].vwap <= 0) {
      return true;
    }
  }
  return false;
}

function chandleTrendMfiVwapComparison5m(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent) {
  if ((vwapLogicLast < vwapLogic || mfLast < mf) && (lastScore < scoreCurrent || (lastScore === 10 && scoreCurrent === 10))) {
    return true;
  }
  return false;
}

async function longTrade5mLast(array) {
  array.reverse();
  console.log('Предыдущие 5 минут', array[1].time);
  const lastPrice = array[1].close;
  const openPrice = array[1].open;
  const vwapLogic = array[1].vwap;
  const vwapLogicLast = array[2].vwap;
  const { mf } = array[1];
  const mfLast = array[2].mf;
  const scoreCurrent = array[1].score;
  const lastScore = array[2].score;
  const bw2Current = array[1].bw2;
  const bw2last = array[2].bw2;
  console.log('Время', array[1].time);
  console.log('Последняя цена', lastPrice);
  console.log('Цена открытия', openPrice);
  console.log('вивап цена', vwapLogic);
  console.log('вивап предыдущая цена', vwapLogicLast);
  console.log('мф цена', mf);
  console.log('мф предыдущая цена', mfLast);
  console.log('scoreCurrent цена', scoreCurrent);
  console.log('lastScore предыдущая цена', lastScore);
  console.log('bw2Current ', bw2Current);
  console.log('bw2last', bw2last);
  console.log('bw2 сравнение ', bw2Func(bw2last, bw2Current));
  console.log('chandleTrendMfiVwapComparison5m ', chandleTrendMfiVwapComparison5m(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent));
  if (vwapLogic >= 3.5 && openPrice < lastPrice && chandleTrendMfiVwapComparison5m(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent)) {
    console.log('логика true');
    return true;
  }
  console.log('логика false');
  return false;
}
async function longTrade5m(array) {
  array.reverse();
  console.log('Текущие 5 минут', array[0].time);
  const lastPrice = array[0].close;
  const openPrice = array[0].open;
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  const scoreCurrent = array[0].score;
  const lastScore = array[1].score;
  const bw2Current = array[0].bw2;
  const bw2last = array[1].bw2;
  console.log('Время', array[0].time);
  console.log('Последняя цена', lastPrice);
  console.log('Цена открытия', openPrice);
  console.log('вивап цена', vwapLogic);
  console.log('вивап предыдущая цена', vwapLogicLast);
  console.log('мф цена', mf);
  console.log('мф предыдущая цена', mfLast);
  console.log('scoreCurrent цена', scoreCurrent);
  console.log('lastScore предыдущая цена', lastScore);
  console.log('bw2Current ', bw2Current);
  console.log('bw2last', bw2last);
  console.log('Кроссовер ', crossowerLast5m(array));
  console.log('bw2 сравнение ', bw2Func(bw2last, bw2Current));
  console.log('chandleTrendMfiVwapComparison5m ', chandleTrendMfiVwapComparison5m(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent));
  if (vwapLogic >= 3.5 && openPrice < lastPrice && crossowerLast5m(array) && chandleTrendMfiVwapComparison5m(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent)) {
    console.log('логика true');
    return true;
  }
  console.log('логика false');
  return false;
}

async function longTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit) {
  let getapikey = null;
  try {
    getapikey = await client.getApiKeyInfo();
  } catch (error) {
    console.log('Ошибка получения ключей');
  }
  try {
    if (getapikey.ret_msg === 'OK') {
      console.log('Ключи подтверждены');
      // Получение данных о балансе
      const balance = await client.getWalletBalance({ symbol });
      const balanceUSDT = Number(balance.result.USDT.available_balance);
      const longDeposit = (balanceUSDT * sizeDeposit) / 100;
      console.log(`Баланс id ${id} символ ${symbol}`, balanceUSDT);
      console.log(`Сумма позиции id ${id} символ ${symbol}`, longDeposit);
      const priceBybit = await client.getTickers({ symbol });
      // Получение данных о последней цене
      const lastPrice = Number(priceBybit.result[0].last_price);
      console.log(`Последняя цена  id ${id} символ ${symbol}`, lastPrice);
      // Количество покупаемого актива
      // Стоимость стоп лосса  =  стоимость актива - (стоп лосс % * стоимость актива/100)/кредитное плечо
      const countActive = (longDeposit / lastPrice).toFixed(5);
      console.log(`Количество актива_${id}_${symbol}`, countActive);
      const stopLossRes = (((stoploss * lastPrice) / 100) * countActive).toFixed(2);
      console.log('Стоп лосс без учета кредитного плеча ', stopLossRes);
      const stopLossTrade = (lastPrice - stopLossRes / leverage).toFixed(2);
      // Расчет стоп-лоса
      console.log('Размер стоп лосса', stopLossTrade);
      console.log(`Стоп лосс id ${id} символ ${symbol}`, stopLossTrade);
      const period6hData = storage.getItem(`period6hData_${id}_${symbol}`);
      const period6hDataCipherB = await cipherB(period6hData);
      const period6hDataChandeTrendScore = await chandeTrendScore(period6hData);
      const period6hDataCipherBwithTime = await period6hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period6hDataCipherB[0][i], bw2: period6hDataCipherB[1][i], vwap: period6hDataCipherB[2][i], mf: period6hDataCipherB[3][i], score: period6hDataChandeTrendScore[i],
      }));
      const array6H = period6hDataCipherBwithTime.filter((el, index) => index > period6hDataCipherBwithTime.length - 3);
      const period6Hresult = await longTrade6h(array6H);
      await storage.addItem(`period6hLongBoolean_${id}_${symbol}`, period6Hresult);
      const time6h = Number(period6hDataCipherBwithTime[period6hDataCipherBwithTime.length - 1].time);
      const milliseconds6h = time6h * 1000;
      const dateObject6h = new Date(milliseconds6h);
      const humanDateFormat6h = dateObject6h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat6h);
      console.log(`Проверка входа на 6 часов для id ${id}`, storage.getItem(`period6hLongBoolean_${id}_${symbol}`));
      const period2hData = storage.getItem(`period2hData_${id}_${symbol}`);
      const period2hDataCipherB = await cipherB(period2hData);
      const period2hDataChandeTrendScore = await chandeTrendScore(period2hData);
      const period2hDataCipherBwithTime = await period2hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period2hDataCipherB[0][i], bw2: period2hDataCipherB[1][i], vwap: period2hDataCipherB[2][i], mf: period2hDataCipherB[3][i], score: period2hDataChandeTrendScore[i],
      }));
      const array2H = period2hDataCipherBwithTime.filter((el, index) => index > period2hDataCipherBwithTime.length - 3);
      const period2Hresult = await longTrade2h(array2H);
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
      const array1H = period1hDataCipherBwithTime.filter((el, index) => index > period1hDataCipherBwithTime.length - 3);
      const period1Hresult = await longTrade1h(array1H);
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
      console.log('Символ', symbol);
      const array15 = period15DataCipherBwithTime.filter((el, index) => index > period15DataCipherBwithTime.length - 10);
      const array15Last = period15DataCipherBwithTime.filter((el, index) => index > period15DataCipherBwithTime.length - 10);
      const period15result = await longTrade15(array15);
      const period15resultLast = await longTrade15Last(array15Last);
      await storage.addItem(`period15LongBoolean_${id}_${symbol}`, period15result);
      await storage.addItem(`period15LongBooleanLast_${id}_${symbol}`, period15resultLast);
      const time15 = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 1].time);
      const milliseconds15 = time15 * 1000;
      const dateObject15 = new Date(milliseconds15);
      const humanDateFormat15 = dateObject15.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat15);
      console.log(`Проверка входа на 15 минут для id ${id}`, storage.getItem(`period15LongBoolean_${id}_${symbol}`));

      const period5mData = storage.getItem(`period5Data_${id}_${symbol}`);
      const period5mDataCipherB = await cipherB(period5mData);
      const period5mDataChandeTrendScore = await chandeTrendScore(period5mData);
      const period5mDataCipherBwithTime = await period5mData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period5mDataCipherB[0][i], bw2: period5mDataCipherB[1][i], vwap: period5mDataCipherB[2][i], mf: period5mDataCipherB[3][i], score: period5mDataChandeTrendScore[i],
      }));
      console.log('Символ', symbol);
      const array5 = period5mDataCipherBwithTime.filter((el, index) => index > period5mDataCipherBwithTime.length - 10);
      const array5Last = period5mDataCipherBwithTime.filter((el, index) => index > period5mDataCipherBwithTime.length - 10);
      const period5mresult = await longTrade5m(array5);
      const period5mresultLast = await longTrade5mLast(array5Last);
      await storage.addItem(`period5LongBoolean_${id}_${symbol}`, period5mresult);
      await storage.addItem(`period5LongBooleanLast_${id}_${symbol}`, period5mresultLast);
      const time5 = Number(period5mDataCipherBwithTime[period5mDataCipherBwithTime.length - 1].time);
      const milliseconds5 = time5 * 1000;
      const dateObject5 = new Date(milliseconds5);
      const humanDateFormat5 = dateObject5.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat5);
      console.log(`Проверка входа на 5 минут для id ${id}`, storage.getItem(`period5LongBoolean_${id}_${symbol}`));

      const Long6hBoolean = storage.getItem(`period6hLongBoolean_${id}_${symbol}`);
      const Long2hBoolean = storage.getItem(`period2hLongBoolean_${id}_${symbol}`);
      const Long1hBoolean = storage.getItem(`period1hLongBoolean_${id}_${symbol}`);
      const Long15Boolean = storage.getItem(`period15LongBoolean_${id}_${symbol}`);
      const Long15BooleanLast = storage.getItem(`period15LongBooleanLast_${id}_${symbol}`);
      const Long5Boolean = storage.getItem(`period5LongBoolean_${id}_${symbol}`);
      const period5LongBooleanLast = storage.getItem(`period5LongBooleanLast_${id}_${symbol}`);
      console.log('Логика входов лонг 6 часов', Long6hBoolean);
      console.log('Логика входов лонг 2 часов', Long2hBoolean);
      console.log('Логика входов лонг 1 час', Long1hBoolean);
      console.log('Логика входов лонг 15 минут', Long15Boolean);
      console.log('Логика входов лонг предыдущие 15 минут', Long15BooleanLast);
      console.log('Логика входов лонг 5 минут', Long5Boolean);
      console.log('Логика входов лонг предыдущие 5 минут', period5LongBooleanLast);

      const arrayLongTime = period15DataCipherBwithTime.filter((el, index) => index > period15DataCipherBwithTime.length - 7);

      if ((Long6hBoolean && Long1hBoolean && Long15Boolean && Long15BooleanLast && Long5Boolean && period5LongBooleanLast) || (Long2hBoolean && Long1hBoolean && Long15Boolean && Long15BooleanLast && Long5Boolean && period5LongBooleanLast)) {
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
            searchLastTime(arrayLongTime, id);
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
