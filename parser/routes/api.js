const router = require('express').Router();
const axios = require('axios');

const today = Date.now();
const perios90Days = 7776000000;
const period = today - perios90Days;
// Задание 5 минут 15 минут 24 минут  1 час 2 часа 6 часов 1 день
// Узнать про трейлинт стоп
const getPrice15period = () => {
  setInterval(async () => {
    console.log('Запрос');
    const data15Period = await axios.get(`https://api-swap-rest.bingbon.pro/api/v1/market/getHistoryKlines?symbol=BTC-USDT&klineType=15&startTs=${period}&endTs=${today}`);
    const data15periodData = data15Period.data.data.klines;
    console.log(data15periodData);
  }, 30000);
};
function playgetPrice15period() {
  try {
    getPrice15period();
  } catch (error) {
    setInterval(async () => {
      getPrice15period();
    }, 30000);
  }
}
playgetPrice15period();

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
