const router = require('express').Router();
const axios = require('axios');

const today = Date.now();
const perios30Days = 2592000000;
const period = today - perios30Days;
router.route('/15')
  .get(async (req, res, next) => {
    const { data } = await axios.get(`https://api-swap-rest.bingbon.pro/api/v1/market/getHistoryKlines?symbol=BTC-USDT&klineType=15&startTs=${period}&endTs=${today}`);
    console.log(data.data.klines);
    res.sendStatus(200);
  });

router.route('/60')
  .get(async (req, res, next) => {
    const { data } = await axios.get(`https://api-swap-rest.bingbon.pro/api/v1/market/getHistoryKlines?symbol=BTC-USDT&klineType=60&startTs=${period}&endTs=${today}`);
    console.log(data.data.klines);
    res.sendStatus(200);
  });

router.route('/6h')
  .get(async (req, res, next) => {
    const { data } = await axios.get(`https://api-swap-rest.bingbon.pro/api/v1/market/getHistoryKlines?symbol=BTC-USDT&klineType=360&startTs=${period}&endTs=${today}`);
    console.log(data.data.klines);
    res.sendStatus(200);
  });
router.route('/1D')
  .get(async (req, res, next) => {
    const { data } = await axios.get(`https://api-swap-rest.bingbon.pro/api/v1/market/getHistoryKlines?symbol=BTC-USDT&klineType=1D&startTs=${period}&endTs=${today}`);
    console.log(data.data.klines);
    res.sendStatus(200);
  });

module.exports = router;
