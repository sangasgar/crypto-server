const router = require('express').Router();
const axios = require('axios');

router.route('/')
  .get(async (req, res, next) => {
    const data = await axios.get('https://data.nasdaq.com/api/v3/datasets/BCHARTS/BITSTAMPUSD');
    console.log(data.data);
    res.sendStatus(200);
  });

module.exports = router;
