/* eslint-disable max-len */
const storage = require('../storage/storage');
const cipherB = require('../indicators/cipherB');
const chandeTrendScore = require('../indicators/chandeTrendScore');
const { Bots } = require('../db/models');

function shortTrade(array) {
  array.reverse();
  const vwapLogic = array[0].vwap;
  if (vwapLogic < -3.5) {
    return true;
  }
  return false;
}
function shortTrade1h(array) {
  array.reverse();
  const vwapLogic = array[0].vwap;
  const lastScore = array[1].score;
  const scoreCurrent = array[0].score;
  if (vwapLogic < -3.5 && lastScore > scoreCurrent && lastScore > 0 && scoreCurrent > 0) {
    return true;
  }
  return false;
}
function shortTrade15(array) {
  array.reverse();
  const zeroLogic = array[2].vwap;
  const vwapLogic = array[1].vwap;
  const scoreCurrent = array[1].score;
  const lastScore = array[2].score;
  const freeScore = array[3].score;
  const bwRes = array[2].bw2;
  if (zeroLogic >= 0 && vwapLogic < -3.5 && freeScore > lastScore && lastScore > scoreCurrent && bwRes < 150 && bwRes > -20) {
    return true;
  }
  return false;
}

async function shortTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit) {
  const getapikey = await client.getApiKeyInfo();
  if (getapikey.ret_msg === 'OK') {
    console.log(`Ключи подтверждены для id ${id} символ ${symbol}`);
    try {
    // Получение данных о балансе
      const balance = await client.getWalletBalance({ symbol });
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
      const stopLossCount = (stoploss * shortDeposit) / 100;
      // Расчет стоп-лоса
      const stopLossTrade = lastPrice + (((stopLossCount * lastPrice) / (shortDeposit * leverage)) / 2).toFixed(2);
      console.log(`Стоп лосс id ${id} символ ${symbol}`, stopLossTrade);
      const period6hData = storage.getItem(`period6hData_${id}_${symbol}`);
      const period6hDataCipherB = await cipherB(period6hData);
      const period6hDataChandeTrendScore = await chandeTrendScore(period6hData);
      const period6hDataCipherBwithTime = await period6hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period6hDataCipherB[0][i], bw2: period6hDataCipherB[1][i], vwap: period6hDataCipherB[2][i], score: period6hDataChandeTrendScore[i],
      }));
      const period6Hresult = await shortTrade(period6hDataCipherBwithTime);
      await storage.addItem(`period6hShortBoolean_${id}_${symbol}`, period6Hresult);
      const time6h = Number(period6hDataCipherBwithTime[period6hDataCipherBwithTime.length - 1].time);
      const milliseconds6h = time6h * 1000;
      const dateObject6h = new Date(milliseconds6h);
      const humanDateFormat6h = dateObject6h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat6h);
      console.log(`Проверка входа на 6 часов для id ${id}`, storage.getItem(`period6hShortBoolean_${id}_${symbol}`));

      const period2hData = storage.getItem(`period2hData_${id}_${symbol}`);
      const period2hDataCipherB = await cipherB(period2hData);
      const period2hDataChandeTrendScore = await chandeTrendScore(period2hData);
      const period2hDataCipherBwithTime = await period2hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period2hDataCipherB[0][i], bw2: period2hDataCipherB[1][i], vwap: period2hDataCipherB[2][i], score: period2hDataChandeTrendScore[i],
      }));
      const period2Hresult = await shortTrade(period2hDataCipherBwithTime);
      await storage.addItem(`period2hShortBoolean_${id}_${symbol}`, period2Hresult);
      const time2h = Number(period2hDataCipherBwithTime[period2hDataCipherBwithTime.length - 1].time);
      const milliseconds2h = time2h * 1000;
      const dateObject2h = new Date(milliseconds2h);
      const humanDateFormat2h = dateObject2h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat2h);
      console.log(`Проверка входа на 2 часов для id ${id}`, storage.getItem(`period2hShortBoolean_${id}_${symbol}`));
      const period1hData = storage.getItem(`period1hData_${id}_${symbol}`);
      const period1hDataCipherB = await cipherB(period1hData);
      const period1hDataChandeTrendScore = await chandeTrendScore(period1hData);
      const period1hDataCipherBwithTime = await period1hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period1hDataCipherB[0][i], bw2: period1hDataCipherB[1][i], vwap: period1hDataCipherB[2][i], score: period1hDataChandeTrendScore[i],
      }));
      const period1Hresult = await shortTrade1h(period1hDataCipherBwithTime);
      await storage.addItem(`period1hShortBoolean_${id}_${symbol}`, period1Hresult);
      const time1h = Number(period1hDataCipherBwithTime[period1hDataCipherBwithTime.length - 1].time);
      const milliseconds1h = time1h * 1000;
      const dateObject1h = new Date(milliseconds1h);
      const humanDateFormat1h = dateObject1h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat1h);
      console.log(`Проверка входа на 1 час для id ${id}`, storage.getItem(`period1hShortBoolean_${id}_${symbol}`));
      const period15Data = storage.getItem(`period15Data_${id}_${symbol}`);
      const period15DataCipherB = await cipherB(period15Data);
      const period15DataChandeTrendScore = await chandeTrendScore(period15Data);
      const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i], score: period15DataChandeTrendScore[i],
      }));
      console.log('Символ', symbol);
      const period15result = await shortTrade15(period15DataCipherBwithTime);
      await storage.addItem(`period15ShortBoolean_${id}_${symbol}`, period15result);
      const time15 = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 1].time);
      const milliseconds15 = time15 * 1000;
      const dateObject15 = new Date(milliseconds15);
      const humanDateFormat15 = dateObject15.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat15);
      console.log(`Проверка входа на 15 минут для id ${id}`, storage.getItem(`period15ShortBoolean_${id}_${symbol}`));
      const short6hBoolean = storage.getItem(`period6hShortBoolean_${id}_${symbol}`);
      const short2hBoolean = storage.getItem(`period2hShortBoolean_${id}_${symbol}`);
      const short1hBoolean = storage.getItem(`period1hShortBoolean_${id}_${symbol}`);
      const short15Boolean = storage.getItem(`period15ShortBoolean_${id}_${symbol}`);
      if ((short6hBoolean && short1hBoolean && short15Boolean) || (short2hBoolean && short1hBoolean && short15Boolean)) {
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
            await storage.addItem(`positionEnter_${id}`, true);
          }
        }
      }
    } catch (error) {
      console.log(`Ошибка соединения  для id ${id}`);
      await Bots.update({ botStatus: false }, { where: { user_id: id } });
    }
  } else {
    console.log(`Ошибка верификации ключей на бирже для id ${id}`);
    await Bots.update({ botStatus: false }, { where: { user_id: id } });
  }
}
module.exports = shortTradeBybit;
