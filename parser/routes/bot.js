/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
const router = require('express').Router();
const { LinearClient } = require('bybit-api');
const https = require('https');
const { Users } = require('../db/models');
const { Bots } = require('../db/models');
const playBot = require('../middleWare/apiBybit');
const closeLongPosition = require('../logic/closeLongPostiion');
const closeShortPosition = require('../logic/closeShortPostiion');
const longTradeBybit = require('../logic/longTradeBybit');
const shortTradeBybit = require('../logic/shortTradeBybit');
const { Positions } = require('../db/models');
const storage = require('../storage/storage');

function checkWebsite(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        console.log(url, res.statusCode);
        resolve(res.statusCode === 200);
      })
      .on('error', (e) => {
        resolve(false);
      });
  });
}
async function test() {
  const check = await checkWebsite('https://testnet.bybit.com/');
  console.log(check); // true
}
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
      let getapikey = null;
      try {
        getapikey = await client.getApiKeyInfo();
        console.log(getapikey);
      } catch (error) {
        console.log(`Ошибка получения данных у id ${id}`);
      }
      let postition = null;
      try {
        postition = userJson.Positions.map((el) => el.symbol);
      } catch (error) {
        console.log(`Ошибка получения позиций у id ${id}`);
      }
      let timer = null;
      try {
        timer = setInterval(async () => {
          storage.addItem(`timer_${userJson.id}`, timer);
          if (botBool === false) {
            const timerUser = storage.getItem(`timer_${userJson.id}`);
            console.log('Bot stop');
            clearInterval(timerUser);
          }
          if (test()) {
            try {
              console.log('1');
              postition.forEach((symbol) => {
                setTimeout(async () => {
                  console.log('2');
                  await playBot(id, client, symbol);
                  console.log('3');
                  await closeLongPosition(id, client, symbol);
                  console.log('4');
                  await closeShortPosition(id, client, symbol);
                }, 2000);
              });
              console.log('5');
              let sizesSymbol = [];
              try {
                console.log('6');
                sizesSymbol = await client.getPosition();
                console.log('7');
              } catch (error) {
                console.log(`Ошибка получения позиций у id ${id}`);
              }
              console.log('8');
              const sizies = sizesSymbol.result.reduce((prev, el) => prev + el.data.size, 0);
              const positionEnter = storage.getItem(`positionEnter_${id}`);
              if ((sizies === 0 && positionEnter === undefined) || (sizies === 0 && positionEnter === null)) {
                console.log(`Есть возможность зайти в позицию  у id ${id}`);
                postition.forEach((symbol) => {
                  setTimeout(async () => {
                    console.log('9');
                    await longTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit);
                    console.log('10');
                    await shortTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit);
                  }, 10000);
                });
              } else if (sizies === 0 && positionEnter === true) {
                console.log(`Бот вылетел по стоп-лоссу у id ${id}`);
                await Bots.update({ botStatus: false }, { where: { user_id: id } });
                const timerUser = storage.getItem(`timer_${userJson.id}`);
                console.log('Bot stop');
                clearInterval(timerUser);
              } else if (sizies > 0) {
                console.log(`Есть купленные позиции объемом ${sizies} у id ${id}`);
              }
            } catch (error) {
              console.log(`Ошибка соединения у id ${id}`);
              if (botBool === false) {
                const timerUser = storage.getItem(`timer_${userJson.id}`);
                console.log('Bot stop');
                clearInterval(timerUser);
              }
            }
          } else {
            console.log(`Проверка соединения у ${id}`);
          }
        }, 10000);
      } catch (error) {
        console.log(`Ошибка соединения у id вне setintervala ${id}`);
      }
    } else {
      const timerUser = storage.getItem(`timer_${userJson.id}`);
      console.log('Bot stop');
      clearInterval(timerUser);
    }
    res.json(botsJson);
  });

module.exports = router;
