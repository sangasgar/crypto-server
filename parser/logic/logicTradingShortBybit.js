/* eslint-disable max-len */
const { LinearClient } = require('bybit-api');
const { Users } = require('../db/models');
const storage = require('../storage/storage');
const cipherB = require('../indicators/cipherB');
const bullTv = require('../indicators/bullTv');

const useLivenet = false;

function longTrade(array) {
  const vwapLogic = Number(array[array.length - 1].vwap);
  const bw1Logic = Number(array[array.length - 1].bw1);
  const bw2Logic = Number(array[array.length - 1].bw2);
  const bullLogic = Number(array[array.length - 1].bullTV);
  const bullLogicPrev = Number(array[array.length - 2].bullTV);
  if (vwapLogic < 0 && bw1Logic < bw2Logic && bullLogic === 4 && bullLogicPrev !== 4) {
    return true;
  }
  return false;
}
function longTrade15(array) {
  const vwapLogic = Number(array[array.length - 1].vwap);
  const bw1Logic = Number(array[array.length - 1].bw1);
  const bw2Logic = Number(array[array.length - 1].bw2);
  const differenceBw1LogicBw2Logic = Math.abs(bw1Logic) - Math.abs(bw2Logic);
  const bullLogic = Number(array[array.length - 1].bullTV);
  // const bullLogicPrev = Number(array[array.length - 2].bullTV);
  // (vwapLogic < 0 && bw1Logic < bw2Logic && bullLogic === 4 && bullLogicPrev !== 4 && differenceBw1LogicBw2Logic > 5)
  if (vwapLogic < 0 && bw1Logic < bw2Logic && bullLogic === 4 && differenceBw1LogicBw2Logic > 5) {
    return true;
  }
  return false;
}
async function logicTradingShortBybit() {
  console.log('Проверка на возможность входа в позицию шорт');
  const user = await Users.findOne({ where: { id: 1 } });
  const userJson = JSON.parse(JSON.stringify(user));
  const BOT_STATUS = userJson.botStatus;
  if (BOT_STATUS) {
    try {
      const API_KEY = userJson.publicKey;
      const PRIVATE_KEY = userJson.privateKey;
      const { symbol } = userJson;
      const { leverage } = userJson;
      const { stoploss } = userJson;
      const { sizeDeposit } = userJson;
      const restClientOptions = { recv_window: 20000 };
      const client = new LinearClient(
        API_KEY,
        PRIVATE_KEY,

        // optional, uses testnet by default. Set to 'true' to use livenet.
        useLivenet,

        restClientOptions,
      // requestLibraryOptions
      );
      const getapikey = await client.getApiKeyInfo();
      if (getapikey.ret_msg === 'OK') {
        console.log('Ключи подтверждены');
      } else {
        console.log('Ошибка верификации ключей на бирже');
        try {
          await Users.update({ botStatus: false }, { where: { id: 1 } });
        } catch (error) {
          console.log('Ошибка подключения к базе данных');
        }
      }
      // Получение данных о балансе
      const balance = await client.getWalletBalance({ symbol });
      const balanceUSDT = Number(balance.result.USDT.available_balance);
      const longDeposit = (balanceUSDT * sizeDeposit) / 100;

      // Получение данных о последней цене
      const priceBybit = await client.getTickers({ symbol });
      const lastPrice = Number(priceBybit.result[0].last_price);
      // Количество покупаемого актива
      const countActive = (longDeposit / lastPrice).toFixed(2);

      // Расчет стоп-лоса
      // const stopLossTrade = (lastPrice + (lastPrice * stoploss) / 100).toFixed(2);
      const stopLossTrade = (lastPrice + (longDeposit * stoploss) / 100).toFixed(2);
      const period6hData = storage.getItem('period6hData');
      const period6hDataCipherB = await cipherB(period6hData);
      const period6hDataBullTv = await bullTv(period6hData);
      const period6hDataCipherBwithTime = await period6hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period6hDataCipherB[0][i], bw2: period6hDataCipherB[1][i], vwap: period6hDataCipherB[2][i], bullTV: period6hDataBullTv[i],
      }));
      const period6Hresult = await longTrade(period6hDataCipherBwithTime);
      await storage.addItem('period6hLongBoolean', period6Hresult);
      const time6h = Number(period6hDataCipherBwithTime[period6hDataCipherBwithTime.length - 1].time);
      const milliseconds6h = time6h * 1000;
      const dateObject6h = new Date(milliseconds6h);
      const humanDateFormat6h = dateObject6h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat6h);
      console.log('Проверка входа на 6 часов', storage.getItem('period6hLongBoolean'));

      const period2hData = storage.getItem('period2hData');
      const period2hDataCipherB = await cipherB(period2hData);
      const period2hDataBullTv = await bullTv(period2hData);
      const period2hDataCipherBwithTime = await period2hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period2hDataCipherB[0][i], bw2: period2hDataCipherB[1][i], vwap: period2hDataCipherB[2][i], bullTV: period2hDataBullTv[i],
      }));
      const period2Hresult = await longTrade(period2hDataCipherBwithTime);
      await storage.addItem('period2hLongBoolean', period2Hresult);
      const time2h = Number(period2hDataCipherBwithTime[period2hDataCipherBwithTime.length - 1].time);
      const milliseconds2h = time2h * 1000;
      const dateObject2h = new Date(milliseconds2h);
      const humanDateFormat2h = dateObject2h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat2h);
      console.log('Проверка входа на 2 часа', storage.getItem('period2hLongBoolean'));

      const period1hData = storage.getItem('period1hData');
      const period1hDataCipherB = await cipherB(period1hData);
      const period1hDataBullTv = await bullTv(period1hData);
      const period1hDataCipherBwithTime = await period1hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period1hDataCipherB[0][i], bw2: period1hDataCipherB[1][i], vwap: period1hDataCipherB[2][i], bullTV: period1hDataBullTv[i],
      }));
      const period1Hresult = await longTrade(period1hDataCipherBwithTime);
      await storage.addItem('period1hLongBoolean', period1Hresult);
      const time1h = Number(period1hDataCipherBwithTime[period1hDataCipherBwithTime.length - 1].time);
      const milliseconds1h = time1h * 1000;
      const dateObject1h = new Date(milliseconds1h);
      const humanDateFormat1h = dateObject1h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat1h);
      console.log('Проверка входа на 1 час', storage.getItem('period1hLongBoolean'));

      const period15Data = storage.getItem('period15Data');
      const period15DataCipherB = await cipherB(period15Data);
      const period15DataBullTv = await bullTv(period15Data);
      const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i], bullTV: period15DataBullTv[i],
      }));
      const period15result = await longTrade15(period15DataCipherBwithTime);
      await storage.addItem('period15LongBoolean', period15result);
      const time15 = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 1].time);
      const milliseconds15 = time15 * 1000;
      const dateObject15 = new Date(milliseconds15);
      const humanDateFormat15 = dateObject15.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat15);
      console.log('Проверка входа на 15 минут', storage.getItem('period15LongBoolean'));

      // const period5Data = storage.getItem('period5Data');
      // const period5DataCipherB = await cipherB(period5Data);
      // const period5DataBullTv = await bullTv(period5Data);
      // const period5DataCipherBwithTime = await period5Data.map((el, i) => ({
      //   time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period5DataCipherB[0][i], bw2: period5DataCipherB[1][i], vwap: period5DataCipherB[2][i], bullTV: period5DataBullTv[i],
      // }));
      // const period5result = await longTrade(period5DataCipherBwithTime);
      // await storage.addItem('period5LongBoolean', period5result);
      // console.log('Проверка входа на 5 минут', storage.getItem('period5LongBoolean'));

      const Long6hBoolean = storage.getItem('period6hLongBoolean');
      const Long2hBoolean = storage.getItem('period2hLongBoolean');
      const Long1hBoolean = storage.getItem('period1hLongBoolean');
      const Long15Boolean = storage.getItem('period15LongBoolean');
      // const Long5Boolean = storage.getItem('period5LongBoolean');
      // Вход в позицию
      // Long6hBoolean && Long1hBoolean && Long15Boolean && Long5Boolean
      // (Long6hBoolean && Long1hBoolean && Long15Boolean) || (Long2hBoolean && Long1hBoolean && Long15Boolean)
      if ((Long6hBoolean && Long1hBoolean && Long15Boolean) || (Long2hBoolean && Long1hBoolean && Long15Boolean)) {
        console.log('Проверка возможности входа в позицию');
        await client.setMarginSwitch({
          symbol, buy_leverage: leverage, sell_leverage: leverage, is_isolated: false,
        });
        const isIsolated = await client.setMarginSwitch({
          symbol, buy_leverage: leverage, sell_leverage: leverage, is_isolated: true,
        });
        if (isIsolated.ret_msg === 'OK') {
          const positionBTCUSDT = await client.getPosition({ symbol: 'BTCUSDT' });
          const positionETHUSDT = await client.getPosition({ symbol: 'ETHUSDT' });
          if (Number(positionBTCUSDT.result[0].size) === 0 && Number(positionETHUSDT.result[0].size) === 0) {
            console.log('Вход в позицию шорт');
            const longPosition = await client.placeActiveOrder({
              symbol, side: 'Sell', qty: countActive, order_type: 'Market', close_on_trigger: false, reduce_only: false, stop_loss: stopLossTrade, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
            });
            console.log(longPosition);
            if (longPosition.ret_msg === 'OK') {
              console.log('Позиция шорт открыта');
              storage.addItem('Position', 'short');
              const vwapLogic = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 1].vwap);
              storage.addItem('vwap', vwapLogic);
            } else {
              console.log('Не вошла в позицию шорт, так как возможно существует уже открыта позиция');
            }
            // Выход из позиции
          } else {
            console.log('Не вошла в позицию шорт, так как возможно существует уже открытая позиция');
          }
        }
      } else {
        console.log('Не подтверждены условия для входа в шорт');
        console.log('Проверка на возможность закрытия позиции шорт');
        const vwapLast = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 1].vwap);
        // vwapLast === 0 || vwapLast < 0
        const closeBw1 = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 1].bw1);
        const closeBw2 = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 1].bw2);
        const differenceСloseBw1СloseBw2 = Math.abs(closeBw1) - Math.abs(closeBw2);
        const positionBTCUSDT = await client.getPosition({ symbol: 'BTCUSDT' });
        const positionETHUSDT = await client.getPosition({ symbol: 'ETHUSDT' });
        const positionBTCUSDTsize = Number(positionBTCUSDT.result[1].size);
        const positionETHUSDTsize = Number(positionETHUSDT.result[1].size);
        if (positionBTCUSDTsize > 0 || positionETHUSDTsize > 0) {
          if (vwapLast === 0 || vwapLast > 0 || differenceСloseBw1СloseBw2 <= 5) {
            let sizeQty = 0;
            if (positionBTCUSDTsize > 0) {
              sizeQty = positionBTCUSDTsize;
            } else {
              sizeQty = positionETHUSDTsize;
            }
            if (sizeQty > 0) {
              const closePosition = await client.placeActiveOrder({
                symbol, side: 'Buy', qty: sizeQty, order_type: 'Market', close_on_trigger: false, reduce_only: true, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
              });
              if (closePosition.ret_msg === 'OK') {
                storage.addItem('Position', 'flat');
                console.log('Позиция закрыта');
              } else {
                console.log('Позиция не закрыта');
              }
            }
          }
        } else {
          console.log('Открытых позиций нет');
        }
      }
    } catch (error) {
      console.log('Ошибка расчетов');
    }
  } else {
    console.log('Бот выключен');
  }
}

module.exports = logicTradingShortBybit;
