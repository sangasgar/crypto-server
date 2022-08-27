/* eslint-disable max-len */
const router = require('express').Router();
const axios = require('axios');

const today = Date.now();
const period = {
  five: '5m',
  fifteen: '15m',
  firteen: '30m',
  onehour: '1h',
  twohour: '2h',
  sixhour: '6h',
};

router.route('/data-5m')
  .get(async (req, res, next) => {
    const data5Period = await axios.get(`https://api-testnet.bybit.com/spot/quote/v1/kline?symbol=BTCUSDT&interval=${period.five}&endTime=${today}&limit=1000`);
    const data5periodData = data5Period.data.result;
    const period5Data = data5periodData.map((el) => ({
      time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
    }));
    res.json(period5Data);
  });
router.route('/data-15m')
  .get(async (req, res, next) => {
    const data15Period = await axios.get(`https://api-testnet.bybit.com/spot/quote/v1/kline?symbol=BTCUSDT&interval=${period.fifteen}&endTime=${today}&limit=1000`);
    const data15periodData = data15Period.data.result;
    const period15Data = data15periodData.map((el) => ({
      time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
    }));
    res.json(period15Data);
  });
router.route('/data-30m')
  .get(async (req, res, next) => {
    const data30mPeriod = await axios.get(`https://api-testnet.bybit.com/spot/quote/v1/kline?symbol=BTCUSDT&interval=${period.firteen}&endTime=${today}&limit=1000`);
    const data30mperiodData = data30mPeriod.data.result;
    const period30mData = data30mperiodData.map((el) => ({
      time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
    }));
    res.json(period30mData);
  });
router.route('/data-1h')
  .get(async (req, res, next) => {
    const data1hPeriod = await axios.get(`https://api-testnet.bybit.com/spot/quote/v1/kline?symbol=BTCUSDT&interval=${period.onehour}&endTime=${today}&limit=1000`);
    const data1hperiodData = data1hPeriod.data.result;
    const period1hData = data1hperiodData.map((el) => ({
      time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
    }));
    res.json(period1hData);
  });
router.route('/data-2h')
  .get(async (req, res, next) => {
    const data2hPeriod = await axios.get(`https://api-testnet.bybit.com/spot/quote/v1/kline?symbol=BTCUSDT&interval=${period.twohour}&endTime=${today}&limit=1000`);
    const data2hperiodData = data2hPeriod.data.result;
    const period2hData = data2hperiodData.map((el) => ({
      time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
    }));
    res.json(period2hData);
  });
router.route('/data-6h')
  .get(async (req, res, next) => {
    const data6hPeriod = await axios.get(`https://api-testnet.bybit.com/spot/quote/v1/kline?symbol=BTCUSDT&interval=${period.sixhour}&endTime=${today}&limit=1000`);
    const data6hperiodData = data6hPeriod.data.result;
    const period6hData = data6hperiodData.map((el) => ({
      time: el[0] / 1000, open: Number(el[1]), high: Number(el[2]), low: Number(el[3]), close: Number(el[4]), volume: Number(el[5]),
    }));
    res.json(period6hData);
  });
module.exports = router;
