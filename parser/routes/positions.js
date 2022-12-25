const express = require('express');
const { Positions } = require('../db/models');
const auth = require('../middleWare/auth');
const router = express.Router();
/* GET home page. */
router.route('/')
  .post(auth, async (req, res, next) => {
    const { input } = req.body;
    if (input) {
      try {
        await Positions.create({ symbol: input });
        res.json({ bd: true });
      } catch (error) {
        res.json({ bd: false });
      }
    }
  })
  .get(async (req, res, next) => {
    try {
      const position = await Positions.findAll();
      const positionJson = JSON.parse(JSON.stringify(position));
      res.json(positionJson);
    } catch (error) {
      res.json({ bdPosition: false });
    }
  });
router.route('/delete')
  .post(auth, async (req, res) => {
    const { id } = req.body;
    if (id) {
      try {
        await Positions.destroy({ where: { id } });
        res.json({ delete: true });
      } catch (error) {
        res.json({ delete: false });
      }
    }
  });
module.exports = router;
