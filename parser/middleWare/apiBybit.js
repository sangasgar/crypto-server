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

async function playBot(id, client, symbol) {
  try {
    const today = Date.now();
    console.log('100');
    const data5Period = await client.getKline({
      symbol, interval: period.five, from: Math.floor((today - Number(period.five) * 200 * 60 * 1000) / 1000), limit: 200,
    });
    console.log('101');
    const data5periodData = data5Period.result;
    const period5Data = HeikinAshi(data5periodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    console.log('102');
    storage.addItem(`period5Data_${id}_${symbol}`, period5Data);
    const data15Period = await client.getKline({
      symbol, interval: period.fifteen, from: Math.floor((today - Number(period.fifteen) * 200 * 60 * 1000) / 1000), limit: 200,
    });
    console.log('103');
    const data15periodData = data15Period.result;
    const period15Data = HeikinAshi(data15periodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    console.log('104');
    storage.addItem(`period15Data_${id}_${symbol}`, period15Data);
    const data30mPeriod = await client.getKline({
      symbol, interval: period.firteen, from: Math.floor((today - Number(period.firteen) * 200 * 60 * 1000) / 1000), limit: 200,
    });
    console.log('105');
    const data30mperiodData = data30mPeriod.result;
    const period30mData = HeikinAshi(data30mperiodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    console.log('106');
    storage.addItem(`period30mData_${id}_${symbol}`, period30mData);
    const data1hPeriod = await client.getKline({
      symbol, interval: period.onehour, from: Math.floor((today - Number(period.onehour) * 200 * 60 * 1000) / 1000), limit: 200,
    });
    const data1hperiodData = data1hPeriod.result;
    console.log('107');
    const period1hData = HeikinAshi(data1hperiodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    console.log('108');
    storage.addItem(`period1hData_${id}_${symbol}`, period1hData);
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
    console.log('109');
    storage.addItem(`period2hData_${id}_${symbol}`, period2hData);
    const data6hPeriod = await client.getKline({
      symbol, interval: period.sixhour, from: Math.floor((today - Number(period.sixhour) * 200 * 60 * 1000) / 1000), limit: 200,
    });
    const data6hperiodData = data6hPeriod.result;
    console.log('110');
    const period6hData = HeikinAshi(data6hperiodData.map((el) => ({
      time: el.start_at, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume,
    })), {
      overWrite: false,
      formatNumbers: false,
      decimals: 4,
      forceExactDecimals: false,
    });
    storage.addItem(`period6hData_${id}_${symbol}`, period6hData);
  } catch (error) {
    console.log('Ошибка парсера, возможно нет соединения');
  }
}
module.exports = playBot;
