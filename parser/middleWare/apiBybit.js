const axios = require('axios');
const HeikinAshi = require('heikinashi');
/* eslint-disable max-len */
const cipherB = require('../indicators/cipherB');
const bullTv = require('../indicators/bullTv');
const storage = require('../storage/storage');

const period = {
  five: '5',
  fifteen: '15',
  firteen: '30',
  onehour: '60',
  twohour: '120',
  sixhour: '360',
};
async function playBot() {
  const today = Date.now();
  console.log('bot start');
  const data5Period = await axios.get(`https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=BTCUSDT&interval=${period.five}&start=${today - Number(period.five) * 200 * 60 * 1000}&end=${today}&limit=200`);
  const data5periodData = data5Period.data.result.list;
  const period5Data = HeikinAshi(data5periodData.map((el) => ({
    time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
  })).reverse(), {
    overWrite: false,
    formatNumbers: false,
    decimals: 4,
    forceExactDecimals: false,
  });
  storage.addItem('period5Data', period5Data);
  const data15Period = await axios.get(`https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=BTCUSDT&interval=${period.fifteen}&start=${today - Number(period.fifteen) * 200 * 60 * 1000}&end=${today}&limit=200`);
  const data15periodData = data15Period.data.result.list;
  const period15Data = HeikinAshi(data15periodData.map((el) => ({
    time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
  })).reverse(), {
    overWrite: false,
    formatNumbers: false,
    decimals: 4,
    forceExactDecimals: false,
  });
  storage.addItem('period15Data', period15Data);
  const data30mPeriod = await axios.get(`https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=BTCUSDT&interval=${period.firteen}&start=${today - Number(period.firteen) * 200 * 60 * 1000}&end=${today}&limit=200`);
  const data30mperiodData = data30mPeriod.data.result.list;
  const period30mData = HeikinAshi(data30mperiodData.map((el) => ({
    time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
  })).reverse(), {
    overWrite: false,
    formatNumbers: false,
    decimals: 4,
    forceExactDecimals: false,
  });
  storage.addItem('period30mData', period30mData);
  const data1hPeriod = await axios.get(`https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=BTCUSDT&interval=${period.onehour}&start=${today - Number(period.onehour) * 200 * 60 * 1000}&end=${today}&limit=200`);
  const data1hperiodData = data1hPeriod.data.result.list;
  const period1hData = HeikinAshi(data1hperiodData.map((el) => ({
    time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
  })).reverse(), {
    overWrite: false,
    formatNumbers: false,
    decimals: 4,
    forceExactDecimals: false,
  });
  storage.addItem('period1hData', period1hData);
  const bull = await bullTv(period1hData);
  const bullWithtime = period1hData.map((el, i) => ({
    time: el.time, bull: bull[i],
  }));
  const data2hPeriod = await axios.get(`https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=BTCUSDT&interval=${period.twohour}&start=${today - Number(period.twohour) * 200 * 60 * 1000}&end=${today}&limit=200`);
  const data2hperiodData = data2hPeriod.data.result.list;
  const period2hData = HeikinAshi(data2hperiodData.map((el) => ({
    time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
  })).reverse(), {
    overWrite: false,
    formatNumbers: false,
    decimals: 4,
    forceExactDecimals: false,
  });
  storage.addItem('period2hData', period2hData);
  const data6hPeriod = await axios.get(`https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=BTCUSDT&interval=${period.sixhour}&start=${today - Number(period.sixhour) * 200 * 60 * 1000}&end=${today}&limit=200`);
  const data6hperiodData = data6hPeriod.data.result.list;
  const period6hData = HeikinAshi(data6hperiodData.map((el) => ({
    time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
  })).reverse(), {
    overWrite: false,
    formatNumbers: false,
    decimals: 4,
    forceExactDecimals: false,
  });
  storage.addItem('period6hData', period6hData);
  console.log('down bot');
}
module.exports = playBot;
