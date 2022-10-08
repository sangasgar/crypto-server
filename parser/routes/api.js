/* eslint-disable max-len */
const router = require('express').Router();
const storage = require('../storage/storage');
const playBot = require('../middleWare/apiBybit');
const { Positions } = require('../db/models');

router.route('/data-5m')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    await playBot(id, symbol);
    try {
      const period5Data = storage.getItem(`period5Data_${id}`);
      res.json(period5Data);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/data-15m')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    await playBot(id, symbol);
    try {
      const period15Data = storage.getItem(`period15Data_${id}`);
      console.log(period15Data);
      res.json(period15Data);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/data-30m')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    await playBot(id, symbol);
    try {
      const period30mData = storage.getItem(`period30mData_${id}`);
      res.json(period30mData);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/data-1h')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    await playBot(id, symbol);
    try {
      const period1hData = storage.getItem(`period1hData_${id}`);
      res.json(period1hData);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/data-2h')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    await playBot(id, symbol);
    try {
      const period2hData = storage.getItem(`period2hData_${id}`);
      res.json(period2hData);
    } catch (error) {
      res.json({ error: 'Не авторизирован' });
    }
  });
router.route('/data-6h')
  .post(async (req, res, next) => {
    const { id } = req.body;
    const { symbol } = req.body;
    await playBot(id, symbol);
    try {
      const period6hData = storage.getItem(`period6hData_${id}`);
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
