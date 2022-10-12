const HeikinAshi = require('heikinashi');
/* eslint-disable max-len */
const { LinearClient } = require('bybit-api');
const { Users } = require('../db/models');
const storage = require('../storage/storage');

const useLivenet = true;
const period = {
  five: '5',
  fifteen: '15',
  firteen: '30',
  onehour: '60',
  twohour: '120',
  sixhour: '360',
};

async function playBot(id, symbol) {
  try {
    const user = await Users.findOne({ where: { id } });
    const userJson = JSON.parse(JSON.stringify(user));
    const API_KEY = userJson.publicKey;
    const PRIVATE_KEY = userJson.privateKey;
    const client = new LinearClient(
      API_KEY,
      PRIVATE_KEY,

      // optional, uses testnet by default. Set to 'true' to use livenet.
      useLivenet,

      // restClientOptions,
      // requestLibraryOptions
    );
    const today = Date.now();
    const data5Period = await client.getKline({
      symbol, interval: period.five, from: Math.floor((today - Number(period.five) * 200 * 60 * 1000) / 1000), limit: 200,
    });
    const data5periodData = data5Period.result;
    const period5Data = HeikinAshi(data5periodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    storage.addItem(`period5Data_${userJson.id}_${symbol}`, period5Data);
    const data15Period = await client.getKline({
      symbol, interval: period.fifteen, from: Math.floor((today - Number(period.fifteen) * 200 * 60 * 1000) / 1000), limit: 200,
    });
    const data15periodData = data15Period.result;
    const period15Data = HeikinAshi(data15periodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    storage.addItem(`period15Data_${userJson.id}_${symbol}`, period15Data);
    const data30mPeriod = await client.getKline({
      symbol, interval: period.firteen, from: Math.floor((today - Number(period.firteen) * 200 * 60 * 1000) / 1000), limit: 200,
    });

    const data30mperiodData = data30mPeriod.result;
    const period30mData = HeikinAshi(data30mperiodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    storage.addItem(`period30mData_${userJson.id}_${symbol}`, period30mData);
    const data1hPeriod = await client.getKline({
      symbol, interval: period.onehour, from: Math.floor((today - Number(period.onehour) * 200 * 60 * 1000) / 1000), limit: 200,
    });
    const data1hperiodData = data1hPeriod.result;
    const period1hData = HeikinAshi(data1hperiodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    storage.addItem(`period1hData_${userJson.id}_${symbol}`, period1hData);
    const data2hPeriod = await client.getKline({
      symbol, interval: period.twohour, from: Math.floor((today - Number(period.twohour) * 200 * 60 * 1000) / 1000), limit: 200,
    });
    const data2hperiodData = data2hPeriod.result;
    const period2hData = HeikinAshi(data2hperiodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    storage.addItem(`period2hData_${userJson.id}_${symbol}`, period2hData);
    const data6hPeriod = await client.getKline({
      symbol, interval: period.sixhour, from: Math.floor((today - Number(period.sixhour) * 200 * 60 * 1000) / 1000), limit: 200,
    });
    const data6hperiodData = data6hPeriod.result;
    const period6hData = HeikinAshi(data6hperiodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    storage.addItem(`period6hData_${userJson.id}_${symbol}`, period6hData);
  } catch (error) {
    console.log('Ошибка парсера, возможно нет соединения');
  }
}
module.exports = playBot;
