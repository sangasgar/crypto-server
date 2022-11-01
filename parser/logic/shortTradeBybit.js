/* eslint-disable max-len */
const storage = require('../storage/storage');
const cipherB = require('../indicators/cipherB');
const chandeTrendScore = require('../indicators/chandeTrendScore');

const searchLastTime = (array, id, symbol) => {
  array.reverse();
  const arrayTime = [];
  for (let i = 1; i < array.length; i += 1) {
    arrayTime.push(arrayTime[i].time);
  }
  storage.addItem(`arrayTime__${id}_${symbol}`, arrayTime);
};

async function lastPriceFunc(client, symbol) {
  const priceBybit = await client.getTickers({ symbol });
  // Получение данных о последней цене
  const lastPrice = Number(priceBybit.result[0].last_price);
  return lastPrice;
}

async function shortTrade6h(array, client, symbol) {
  array.reverse();
  const lastPrice = await lastPriceFunc(client, symbol);
  const openPrice = array[0].open;
  const vwapLogic = array[0].vwap;
  // const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  if (vwapLogic <= -3.5 && mfLast > mf && openPrice > lastPrice) {
    return true;
  }
  return false;
}
async function shortTrade2h(array, client, symbol) {
  array.reverse();
  const lastPrice = await lastPriceFunc(client, symbol);
  const openPrice = array[0].open;
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  if (vwapLogic <= -3.5 && openPrice > lastPrice && (vwapLogicLast > vwapLogic || mfLast > mf)) {
    return true;
  }
  return false;
}

function chandleTrendMfiVwapComparisonShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent) {
  if ((vwapLogicLast > vwapLogic || mfLast > mf) && (lastScore > scoreCurrent || (lastScore === -10 && scoreCurrent === -10))) {
    return true;
  }
  return false;
}
async function shortTrade1h(array, client, symbol) {
  array.reverse();
  const lastPrice = await lastPriceFunc(client, symbol);
  const openPrice = array[0].open;
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  const scoreCurrent = array[0].score;
  const lastScore = array[1].score;
  if (vwapLogic <= -3.5 && openPrice > lastPrice && chandleTrendMfiVwapComparisonShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent)) {
    return true;
  }
  return false;
}

function crossowerLast15mShort(array) {
  for (let i = 1; i < 4; i += 1) {
    if (array[i].vwap >= 0) {
      return true;
    }
  }
  return false;
}
function chandleTrendMfiVwapComparison15mShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent, array) {
  if ((vwapLogicLast > vwapLogic || mfLast > mf) && crossowerLast15mShort(array) && (lastScore > scoreCurrent || (lastScore === -10 && scoreCurrent === -10))) {
    return true;
  }
  return false;
}
async function shortTrade15(array, client, symbol) {
  array.reverse();
  const lastPrice = await lastPriceFunc(client, symbol);
  const openPrice = array[0].open;
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  const scoreCurrent = array[0].score;
  const lastScore = array[1].score;
  if (vwapLogic <= -2 && openPrice > lastPrice && chandleTrendMfiVwapComparison15mShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent, array)) {
    return true;
  }
  return false;
}

function crossowerLast5mShort(array) {
  for (let i = 2; i < 5; i += 1) {
    if (array[i].vwap >= 0) {
      return true;
    }
  }
  return false;
}

function bw2FuncShort(bw2last, bw2Current) {
  if (bw2Current < 150 && bw2Current > -50 && bw2Current < bw2last) {
    return true;
  }
  return false;
}
function chandleTrendMfiVwapComparison5mShort(vwapLogicLast, vwapLogic, bw2last, bw2Current, mfLast, mf, lastScore, scoreCurrent, array) {
  if ((vwapLogicLast > vwapLogic || mfLast > mf) && bw2FuncShort(bw2last, bw2Current) && crossowerLast5mShort(array) && (lastScore > scoreCurrent || (lastScore === -10 && scoreCurrent === -10))) {
    return true;
  }
  return false;
}

async function shortTrade5m(array, client, symbol) {
  array.reverse();
  const lastPrice = await lastPriceFunc(client, symbol);
  const openPrice = array[0].open;
  const vwapLogic = array[1].vwap;
  const vwapLogicLast = array[2].vwap;
  const { mf } = array[1];
  const mfLast = array[2].mf;
  const scoreCurrent = array[1].score;
  const lastScore = array[2].score;
  const bw2Current = array[1].bw2;
  const bw2last = array[2].bw2;
  if (vwapLogic <= -3.5 && openPrice > lastPrice && chandleTrendMfiVwapComparison5mShort(vwapLogicLast, vwapLogic, bw2last, bw2Current, mfLast, mf, lastScore, scoreCurrent, array)) {
    return true;
  }
  return false;
}

async function shortTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit) {
  console.log('501');
  let getapikey = null;
  try {
    getapikey = await client.getApiKeyInfo();
  } catch (error) {
    console.log('Ошибка получения ключей');
  }
  try {
    if (getapikey.ret_msg === 'OK') {
      console.log(`Ключи подтверждены для id ${id} символ ${symbol}`);
      // Получение данных о балансе
      const balance = await client.getWalletBalance({ symbol });
      console.log('502');
      const balanceUSDT = Number(balance.result.USDT.available_balance);
      const shortDeposit = (balanceUSDT * sizeDeposit) / 100;
      console.log(`Баланс id ${id} символ ${symbol}`, balanceUSDT);
      console.log(`Сумма позиции id ${id} символ ${symbol}`, shortDeposit);
      const priceBybit = await client.getTickers({ symbol });
      // Получение данных о последней цене
      const lastPrice = Number(priceBybit.result[0].last_price);
      console.log(`Последняя цена id ${id} символ ${symbol}`, lastPrice);
      // Количество покупаемого актива
      const countActive = (shortDeposit / lastPrice).toFixed(2);
      console.log(`Количество актива_${id}_${symbol}`, countActive);
      const stopLossTrade = (lastPrice + ((stoploss * lastPrice) / 100) / leverage).toFixed(2);
      // Расчет стоп-лоса
      console.log(stopLossTrade);
      console.log(`Стоп лосс id ${id} символ ${symbol}`, stopLossTrade);
      console.log('503');
      const period6hData = storage.getItem(`period6hData_${id}_${symbol}`);
      const period6hDataCipherB = await cipherB(period6hData);
      const period6hDataChandeTrendScore = await chandeTrendScore(period6hData);
      const period6hDataCipherBwithTime = await period6hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period6hDataCipherB[0][i], bw2: period6hDataCipherB[1][i], vwap: period6hDataCipherB[2][i], mf: period6hDataCipherB[3][i], score: period6hDataChandeTrendScore[i],
      }));
      console.log('504');
      const period6Hresult = await shortTrade6h(period6hDataCipherBwithTime, client, symbol);
      await storage.addItem(`period6hShortBoolean_${id}_${symbol}`, period6Hresult);
      const time6h = Number(period6hDataCipherBwithTime[period6hDataCipherBwithTime.length - 1].time);
      const milliseconds6h = time6h * 1000;
      const dateObject6h = new Date(milliseconds6h);
      const humanDateFormat6h = dateObject6h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat6h);
      console.log(`Проверка входа на 6 часов для id ${id}`, storage.getItem(`period6hShortBoolean_${id}_${symbol}`));
      console.log('505');
      const period2hData = storage.getItem(`period2hData_${id}_${symbol}`);
      const period2hDataCipherB = await cipherB(period2hData);
      const period2hDataChandeTrendScore = await chandeTrendScore(period2hData);
      const period2hDataCipherBwithTime = await period2hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period2hDataCipherB[0][i], bw2: period2hDataCipherB[1][i], vwap: period2hDataCipherB[2][i], mf: period2hDataCipherB[3][i], score: period2hDataChandeTrendScore[i],
      }));
      const period2Hresult = await shortTrade2h(period2hDataCipherBwithTime, client, symbol);
      await storage.addItem(`period2hShortBoolean_${id}_${symbol}`, period2Hresult);
      const time2h = Number(period2hDataCipherBwithTime[period2hDataCipherBwithTime.length - 1].time);
      const milliseconds2h = time2h * 1000;
      const dateObject2h = new Date(milliseconds2h);
      const humanDateFormat2h = dateObject2h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat2h);
      console.log('505');
      console.log(`Проверка входа на 2 часов для id ${id}`, storage.getItem(`period2hShortBoolean_${id}_${symbol}`));
      const period1hData = storage.getItem(`period1hData_${id}_${symbol}`);
      const period1hDataCipherB = await cipherB(period1hData);
      const period1hDataChandeTrendScore = await chandeTrendScore(period1hData);
      const period1hDataCipherBwithTime = await period1hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period1hDataCipherB[0][i], bw2: period1hDataCipherB[1][i], vwap: period1hDataCipherB[2][i], mf: period1hDataCipherB[3][i], score: period1hDataChandeTrendScore[i],
      }));
      console.log('507');
      const period1Hresult = await shortTrade1h(period1hDataCipherBwithTime, client, symbol);
      await storage.addItem(`period1hShortBoolean_${id}_${symbol}`, period1Hresult);
      const time1h = Number(period1hDataCipherBwithTime[period1hDataCipherBwithTime.length - 1].time);
      const milliseconds1h = time1h * 1000;
      const dateObject1h = new Date(milliseconds1h);
      const humanDateFormat1h = dateObject1h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat1h);
      console.log(`Проверка входа на 1 час для id ${id}`, storage.getItem(`period1hShortBoolean_${id}_${symbol}`));
      const period15Data = storage.getItem(`period15Data_${id}_${symbol}`);
      const period15DataCipherB = await cipherB(period15Data);
      console.log('508');
      const period15DataChandeTrendScore = await chandeTrendScore(period15Data);
      const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i], mf: period15DataCipherB[3][i], score: period15DataChandeTrendScore[i],
      }));
      console.log('Символ', symbol);
      const period15result = await shortTrade15(period15DataCipherBwithTime, client, symbol);
      await storage.addItem(`period15ShortBoolean_${id}_${symbol}`, period15result);
      const time15 = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 1].time);
      const milliseconds15 = time15 * 1000;
      console.log('509');
      const dateObject15 = new Date(milliseconds15);
      const humanDateFormat15 = dateObject15.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat15);
      console.log(`Проверка входа на 15 минут для id ${id}`, storage.getItem(`period15ShortBoolean_${id}_${symbol}`));

      const period5mData = storage.getItem(`period5Data_${id}_${symbol}`);
      const period5mDataCipherB = await cipherB(period5mData);
      const period5mDataChandeTrendScore = await chandeTrendScore(period5mData);
      const period5mDataCipherBwithTime = await period5mData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period5mDataCipherB[0][i], bw2: period5mDataCipherB[1][i], vwap: period5mDataCipherB[2][i], mf: period5mDataCipherB[3][i], score: period5mDataChandeTrendScore[i],
      }));
      console.log('408');
      console.log('Символ', symbol);
      const period5mresult = await shortTrade5m(period5mDataCipherBwithTime, client, symbol);
      await storage.addItem(`period5ShortBoolean_${id}_${symbol}`, period5mresult);
      const time5 = Number(period5mDataCipherBwithTime[period5mDataCipherBwithTime.length - 1].time);
      const milliseconds5 = time5 * 1000;
      const dateObject5 = new Date(milliseconds5);
      const humanDateFormat5 = dateObject5.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat5);
      console.log('409');
      console.log(`Проверка входа на 5 минут для id ${id}`, storage.getItem(`period5ShortBoolean_${id}_${symbol}`));

      const short6hBoolean = storage.getItem(`period6hShortBoolean_${id}_${symbol}`);
      const short2hBoolean = storage.getItem(`period2hShortBoolean_${id}_${symbol}`);
      const short1hBoolean = storage.getItem(`period1hShortBoolean_${id}_${symbol}`);
      const short15Boolean = storage.getItem(`period15ShortBoolean_${id}_${symbol}`);
      const short5Boolean = storage.getItem(`period5ShortBoolean_${id}_${symbol}`);
      if ((short6hBoolean && short1hBoolean && short15Boolean && short5Boolean) || (short2hBoolean && short1hBoolean && short15Boolean && short5Boolean)) {
        console.log(`Проверка возможности входа в позицию для id ${id}`);
        await client.setMarginSwitch({
          symbol, buy_leverage: leverage, sell_leverage: leverage, is_isolated: false,
        });
        const isIsolated = await client.setMarginSwitch({
          symbol, buy_leverage: leverage, sell_leverage: leverage, is_isolated: true,
        });
        if (isIsolated.ret_msg === 'OK') {
          const shortPosition = await client.placeActiveOrder({
            symbol, side: 'Sell', qty: countActive, order_type: 'Market', close_on_trigger: false, reduce_only: false, stop_loss: stopLossTrade, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
          });
          console.log(shortPosition);
          if (shortPosition.ret_msg === 'OK') {
            console.log(`Позиция шорт открыта для id ${id}`);
            searchLastTime(period15DataCipherBwithTime, id, symbol);
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
module.exports = shortTradeBybit;
