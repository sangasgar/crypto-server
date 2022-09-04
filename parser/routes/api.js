/* eslint-disable max-len */
const router = require('express').Router();
const axios = require('axios');
const { LinearClient } = require('bybit-api');
const HeikinAshi = require('heikinashi');
const tulind = require('tulind');
/* eslint-disable max-len */
const { promisify } = require('util');
const cipherB = require('../indicators/cipherB');
const bullTv = require('../indicators/bullTv');

const { API_KEY } = process.env;
const { PRIVATE_KEY } = process.env;
const useLivenet = false;

const client = new LinearClient(
  API_KEY,
  PRIVATE_KEY,

  // optional, uses testnet by default. Set to 'true' to use livenet.
  useLivenet,

  // restClientOptions,
  // requestLibraryOptions
);

const today = Date.now();
const period = {
  five: '5',
  fifteen: '15',
  firteen: '30',
  onehour: '60',
  twohour: '120',
  sixhour: '360',
};

router.route('/data-5m')
  .get(async (req, res, next) => {
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
    res.json(period5Data);
  });
router.route('/data-15m')
  .get(async (req, res, next) => {
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
    res.json(period15Data);
  });
router.route('/data-30m')
  .get(async (req, res, next) => {
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
    res.json(period30mData);
  });
router.route('/data-1h')
  .get(async (req, res, next) => {
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
    const bull = await bullTv(period1hData);
    const bullWithtime = period1hData.map((el, i) => ({
      time: el.time, bull: bull[i],
    }));
    // const cipher = await cipherB(period1hData);
    // const cipherWithtime = period1hData.map((el, i) => ({
    //   time: el.time, bw1: cipher[0][i], bw2: cipher[1][i], vwap: cipher[2][i],
    // }));
    // console.log(cipherWithtime);
    console.log(bullWithtime);
    res.json(period1hData);
  });
router.route('/data-2h')
  .get(async (req, res, next) => {
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
    res.json(period2hData);
  });
router.route('/data-6h')
  .get(async (req, res, next) => {
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
    // const cipher = await cipherB(period6hData);
    // const cipherWithtime = period6hData.map((el, i) => ({time: el.time, bw1: cipher[0][i],  bw2: cipher[1][i],  vwap: cipher[2][i]}))
    // console.log(cipherWithtime);
    res.json(period6hData);
  });
module.exports = router;
