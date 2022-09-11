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
  if (vwapLogic > 0 && bw1Logic > bw2Logic && bullLogic === 1 && bullLogicPrev !== 1) {
    return true;
  }
  return false;
}

async function logicTradingBybit() {
  try {
    const user = await Users.findOne({ where: { id: 1 } });
    const userJson = JSON.parse(JSON.stringify(user));
    const API_KEY = userJson.publicKey;
    const PRIVATE_KEY = userJson.privateKey;
    const BOT_STATUS = userJson.botStatus;
    const restClientOptions = { recv_window: 10000 };
    const client = new LinearClient(
      API_KEY,
      PRIVATE_KEY,

      // optional, uses testnet by default. Set to 'true' to use livenet.
      useLivenet,

      restClientOptions,
      // requestLibraryOptions
    );
    console.log(await client.getApiKeyInfo());
    const period6hData = storage.getItem('period6hData');
    const period6hDataCipherB = await cipherB(period6hData);
    const period6hDataBullTv = await bullTv(period6hData);
    const period6hDataCipherBwithTime = await period6hData.map((el, i) => ({
      time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period6hDataCipherB[0][i], bw2: period6hDataCipherB[1][i], vwap: period6hDataCipherB[2][i], bullTV: period6hDataBullTv[i],
    }));
    // console.log(period6hDataCipherBwithTime);

    const period6Hresult = await longTrade(period6hDataCipherBwithTime);
    await storage.addItem('period6hLongBoolean', period6Hresult);
    console.log(storage.getItem('period6hLongBoolean'));

    const period1hData = storage.getItem('period1hData');
    const period1hDataCipherB = await cipherB(period1hData);
    const period1hDataBullTv = await bullTv(period1hData);
    const period1hDataCipherBwithTime = await period1hData.map((el, i) => ({
      time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period1hDataCipherB[0][i], bw2: period1hDataCipherB[1][i], vwap: period1hDataCipherB[2][i], bullTV: period1hDataBullTv[i],
    }));
    const period1Hresult = await longTrade(period1hDataCipherBwithTime);
    await storage.addItem('period1hLongBoolean', period1Hresult);
    console.log(storage.getItem('period1hLongBoolean'));

    const period15Data = storage.getItem('period15Data');
    const period15DataCipherB = await cipherB(period15Data);
    const period15DataBullTv = await bullTv(period15Data);
    const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
      time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i], bullTV: period15DataBullTv[i],
    }));
    const period15result = await longTrade(period15DataCipherBwithTime);
    await storage.addItem('period15LongBoolean', period15result);
    console.log(storage.getItem('period15LongBoolean'));

    const period5Data = storage.getItem('period5Data');
    const period5DataCipherB = await cipherB(period5Data);
    const period5DataBullTv = await bullTv(period5Data);
    const period5DataCipherBwithTime = await period5Data.map((el, i) => ({
      time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period5DataCipherB[0][i], bw2: period5DataCipherB[1][i], vwap: period5DataCipherB[2][i], bullTV: period5DataBullTv[i],
    }));
    const period5result = await longTrade(period5DataCipherBwithTime);
    await storage.addItem('period5LongBoolean', period5result);
    console.log(storage.getItem('period5LongBoolean'));

    const Long6hBoolean = storage.getItem('period6hLongBoolean');
    const Long1hBoolean = storage.getItem('period1hLongBoolean');
    const Long15Boolean = storage.getItem('period15LongBoolean');
    const Long5Boolean = storage.getItem('period5LongBoolean');
    const balance = await client.getWalletBalance({ symbol: 'BTCUSDT' });
    const balanceUSDT = balance.result.USDT.available_balance;
    console.log(balanceUSDT);
    const priceBybit = await client.getTickers({ symbol: 'BTCUSDT' });
    const lastPrice = priceBybit.result[0].last_price;
    if (Long6hBoolean && Long1hBoolean && Long15Boolean && Long5Boolean) {
      console.log('вход в позицию');
      const longPosition = await client.placeActiveOrder({
        symbol: 'BTCUSDT', side: 'Buy', qty: 2.295, order_type: 'Market', close_on_trigger: true, reduce_only: false, stop_loss: 20717.5, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
      });
    }
  } catch (error) {
    console.log('Ошибка расчетов');
  }
}

module.exports = logicTradingBybit;
