/* eslint-disable max-len */
const router = require('express').Router();
const { LinearClient } = require('bybit-api');
const storage = require('../storage/storage');
const playBot = require('../middleWare/apiBybit');
const { Positions } = require('../db/models');
const { Users } = require('../db/models');

const getDataApi = async (API_KEY, PRIVATE_KEY, id, symbol) => {
  const useLivenet = true;
  const restClientOptions = { recv_window: 20000 };
  let client = null;
  try {
    client = new LinearClient(
      API_KEY,
      PRIVATE_KEY,

      // optional, uses testnet by default. Set to 'true' to use livenet.
      useLivenet,

      restClientOptions,
      // requestLibraryOptions
    );
  } catch (error) {
    console.log(`Ошибка получения данных у id ${id}`);
  }
  await playBot(id, client, symbol);
};

router.route('/data-5m')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    const user = await Users.findOne({ where: { id } });
    const userJson = JSON.parse(JSON.stringify(user));
    const API_KEY = userJson.publicKey;
    const PRIVATE_KEY = userJson.privateKey;
    await getDataApi(API_KEY, PRIVATE_KEY, id, symbol);
    try {
      const period5Data = storage.getItem(`period5Data_${id}_${symbol}`);
      res.json(period5Data);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/data-15m')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    const user = await Users.findOne({ where: { id } });
    const userJson = JSON.parse(JSON.stringify(user));
    const API_KEY = userJson.publicKey;
    const PRIVATE_KEY = userJson.privateKey;
    await getDataApi(API_KEY, PRIVATE_KEY, id, symbol);
    try {
      const period15Data = storage.getItem(`period15Data_${id}_${symbol}`);
      res.json(period15Data);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/data-30m')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    const user = await Users.findOne({ where: { id } });
    const userJson = JSON.parse(JSON.stringify(user));
    const API_KEY = userJson.publicKey;
    const PRIVATE_KEY = userJson.privateKey;
    await getDataApi(API_KEY, PRIVATE_KEY, id, symbol);
    try {
      const period30mData = storage.getItem(`period30mData_${id}_${symbol}`);
      res.json(period30mData);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/data-1h')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    const user = await Users.findOne({ where: { id } });
    const userJson = JSON.parse(JSON.stringify(user));
    const API_KEY = userJson.publicKey;
    const PRIVATE_KEY = userJson.privateKey;
    await getDataApi(API_KEY, PRIVATE_KEY, id, symbol);
    try {
      const period1hData = storage.getItem(`period1hData_${id}_${symbol}`);
      res.json(period1hData);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/data-2h')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    const user = await Users.findOne({ where: { id } });
    const userJson = JSON.parse(JSON.stringify(user));
    const API_KEY = userJson.publicKey;
    const PRIVATE_KEY = userJson.privateKey;
    await getDataApi(API_KEY, PRIVATE_KEY, id, symbol);
    try {
      const period2hData = storage.getItem(`period2hData_${id}_${symbol}`);
      res.json(period2hData);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/data-6h')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    const user = await Users.findOne({ where: { id } });
    const userJson = JSON.parse(JSON.stringify(user));
    const API_KEY = userJson.publicKey;
    const PRIVATE_KEY = userJson.privateKey;
    await getDataApi(API_KEY, PRIVATE_KEY, id, symbol);
    try {
      const period6hData = storage.getItem(`period6hData_${id}_${symbol}`);
      res.json(period6hData);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/positions')
  .get(async (req, res) => {
    try {
      const positions = await Positions.findAll();
      const positionsJson = JSON.parse(JSON.stringify(positions));
      res.json(positionsJson);
    } catch (error) {
      res.json({ error: 'connection error' });
    }
  });
module.exports = router;
