/* eslint-disable max-len */
const router = require('express').Router();
const storage = require('../storage/storage');

router.route('/data-5m')
  .get(async (req, res, next) => {
    const period5Data = storage.getItem('period5Data');
    res.json(period5Data);
  });
router.route('/data-15m')
  .get(async (req, res, next) => {
    const period15Data = storage.getItem('period15Data');
    res.json(period15Data);
  });
router.route('/data-30m')
  .get(async (req, res, next) => {
    const period30mData = storage.getItem('period30mData');
    res.json(period30mData);
  });
router.route('/data-1h')
  .get(async (req, res, next) => {
    const period1hData = storage.getItem('period1hData');
    console.log(period1hData);
    res.json(period1hData);
  });
router.route('/data-2h')
  .get(async (req, res, next) => {
    const period2hData = storage.getItem('period2hData');
    res.json(period2hData);
  });
router.route('/data-6h')
  .get(async (req, res, next) => {
    const period6hData = storage.getItem('period6hData');
    res.json(period6hData);
  });
module.exports = router;
