const router = require('express').Router();
const { LinearClient } = require('bybit-api');
const { Users } = require('../db/models');
const { Bots } = require('../db/models');
const playBot = require('../middleWare/apiBybit');
const closeLongPosition = require('../logic/closeLongPostiion');
const closeShortPosition = require('../logic/closeShortPostiion');
const { Positions } = require('../db/models');

router.route('/bot-status-check')
  .post(async (req, res) => {
    const { id } = req.body;
    try {
      const bots = await Bots.findOne({ where: { user_id: id } });
      const userJson = JSON.parse(JSON.stringify(bots));
      res.json(userJson);
    } catch (error) {
      res.json({ error: 'connection error' });
    }
  });

router.route('/bot-status')
  .put(async (req, res) => {
    const { id } = req.body;
    const { botStatus } = req.body;
    try {
      await Bots.update({ botStatus }, { where: { user_id: id } });
      const bots = await Bots.findOne({ where: { user_id: id } });
      const botsJson = JSON.parse(JSON.stringify(bots));
      if (botsJson.botStatus) {
        const user = await Users.findOne({ where: { id }, include: Positions });
        const userJson = JSON.parse(JSON.stringify(user));
        const API_KEY = userJson.publicKey;
        const PRIVATE_KEY = userJson.privateKey;
        const restClientOptions = { recv_window: 20000 };
        const useLivenet = false;
        const client = new LinearClient(
          API_KEY,
          PRIVATE_KEY,

          // optional, uses testnet by default. Set to 'true' to use livenet.
          useLivenet,

          restClientOptions,
        // requestLibraryOptions
        );
        const postition = userJson.Positions.map((el) => el.symbol);
        postition.forEach((symbol) => {
          setTimeout(async () => {
            await playBot(id, symbol);
            await closeLongPosition(id, client, symbol);
            await closeShortPosition(id, client, symbol);
          }, 2000);
        });
      }

      res.json(botsJson);
    } catch (error) {
      res.json({ error: 'connection error' });
    }
  });

module.exports = router;
