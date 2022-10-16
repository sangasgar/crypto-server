/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
const router = require('express').Router();
const { LinearClient } = require('bybit-api');
const { Users } = require('../db/models');
const { Bots } = require('../db/models');
const playBot = require('../middleWare/apiBybit');
const closeLongPosition = require('../logic/closeLongPostiion');
const closeShortPosition = require('../logic/closeShortPostiion');
const longTradeBybit = require('../logic/longTradeBybit');
const shortTradeBybit = require('../logic/shortTradeBybit');
const { Positions } = require('../db/models');
const storage = require('../storage/storage');

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
      const botBool = botsJson.botStatus;
      const user = await Users.findOne({ where: { id }, include: Positions });
      const userJson = JSON.parse(JSON.stringify(user));
      const { leverage } = userJson;
      const { stoploss } = userJson;
      const { sizeDeposit } = userJson;
      if (botBool) {
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
        const timer = setInterval(async () => {
          try {
            postition.forEach((symbol) => {
              setTimeout(async () => {
                await playBot(id, symbol);
                await closeLongPosition(id, client, symbol);
                await closeShortPosition(id, client, symbol);
              }, 2000);
            });

            try {
              const sizesSymbol = await client.getPosition();
              const sizies = sizesSymbol.result.reduce((prev, el) => prev + el.data.size, 0);
              const positionEnter = storage.getItem(`positionEnter_${id}`);
              if ((sizies === 0 && positionEnter === undefined) || (sizies === 0 && positionEnter === null)) {
                console.log(`Есть возможность зайти в позицию  у id ${id}`);
                postition.forEach((symbol) => {
                  setTimeout(async () => {
                    await longTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit);
                    await shortTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit);
                  }, 10000);
                });
              } else if (sizies === 0 && positionEnter === true) {
                console.log(`Бот вылетел по стоп-лоссу у id ${id}`);
                await Bots.update({ botStatus: false }, { where: { user_id: id } });
              } else if (sizies > 0) {
                console.log(`Есть купленные позиции объемом ${sizies} у id ${id}`);
              }
            } catch (error) {
              console.log(`Ошибка расчетов у id ${id}`);
            }
          } catch (error) {
            console.log(`Ошибка соединения у id ${id}`);
          }
        }, 10000);
        storage.addItem(`timer_${userJson.id}`, timer);
      } else {
        const timerUser = storage.getItem(`timer_${userJson.id}`);
        console.log('Bot stop');
        clearInterval(timerUser);
      }
      res.json(botsJson);
    } catch (error) {
      res.json({ error: 'connection error' });
    }
  });

module.exports = router;
