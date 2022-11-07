/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
const fs = require('fs').promises;

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

function controllerCycle(arrayPos, id) {
  let count = storage.getItem(`count_${id}`);
  if (count === undefined) {
    count = 0;
  } else {
    count += 1;
  }
  if (count === arrayPos.length) {
    count = 0;
  }
  storage.addItem(`count_${id}`, count);
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
router.route('/stop-loss-clear')
  .put(async (req, res) => {
    const { id } = req.body;
    try {
      await storage.addItem(`positionEnter_${id}`, false);
      res.json({ status: true });
    } catch (error) {
      res.json({ status: false });
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
      const useLivenet = true;
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
        await fs.appendFile('logs.txt', `Ошибка получения данных у id ${id}\n`);
        console.log(`Ошибка получения данных у id ${id}`);
      }
      let getapikey = null;
      try {
        await fs.appendFile('logs.txt', `getapikey ${getapikey}\n`);
        getapikey = await client.getApiKeyInfo();
        console.log(getapikey);
      } catch (error) {
        await fs.appendFile('logs.txt', `Ошибка получения данных у id ${id}\n`);
        console.log(`Ошибка получения данных у id ${id}`);
      }
      let postition = null;
      try {
        postition = userJson.Positions.map((el) => el.symbol);
        console.log(postition);
      } catch (error) {
        console.log(`Ошибка получения позиций у id ${id}`);
      }

      try {
        const timer = setInterval(async () => {
          console.clear();
          storage.addItem(`timer_${userJson.id}`, timer);
          if (botBool === false) {
            const timerUser = storage.getItem(`timer_${userJson.id}`);
            await fs.appendFile('logs.txt', 'Bot stop\n');
            console.log('Bot stop');
            clearInterval(timerUser);
          }
          if (test()) {
            try {
              setTimeout(async () => {
                try {
                  controllerCycle(postition, id);
                  const count = storage.getItem(`count_${id}`);
                  const symbol = postition[count];
                  await fs.appendFile('logs.txt', `Цикл ${count}\n`);
                  console.log('Цикл', count);
                  await fs.appendFile('logs.txt', `symbol ${symbol}\n`);
                  console.log(symbol);
                  await playBot(id, client, symbol);
                  await closeLongPosition(id, client, symbol);
                  await closeShortPosition(id, client, symbol);
                  const sizesSymbol = await client.getPosition();
                  const sizies = sizesSymbol.result.reduce((prev, el) => prev + el.data.size, 0);
                  const positionEnter = storage.getItem(`positionEnter_${id}`);
                  if ((sizies === 0 && positionEnter === undefined) || (sizies === 0 && positionEnter === null) || (sizies === 0 && positionEnter === false)) {
                    await fs.appendFile('logs.txt', `Есть возможность зайти в позицию  у id ${id}\n`);
                    console.log(`Есть возможность зайти в позицию  у id ${id}`);
                    await longTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit);
                    await shortTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit);
                  } else if (sizies === 0 && positionEnter === true) {
                    await fs.appendFile('logs.txt', `Бот вылетел по стоп-лоссу у id ${id}\n`);
                    console.log(`Бот вылетел по стоп-лоссу у id ${id}`);
                    await Bots.update({ botStatus: false }, { where: { user_id: id } });
                    const timerUser = storage.getItem(`timer_${id}`);
                    await fs.appendFile('logs.txt', 'Bot stop\n');
                    console.log('Bot stop');
                    clearInterval(timerUser);
                  } else if (sizies > 0) {
                    await fs.appendFile('logs.txt', `Есть купленные позиции объемом ${sizies} у id ${id}\n`);
                    console.log(`Есть купленные позиции объемом ${sizies} у id ${id}`);
                  }
                } catch (error) {
                  await fs.appendFile('logs.txt', `Ошибка соединения у id ${id}\n`);
                  console.log(`Ошибка соединения у id ${id}`);
                }
              }, 3000);
            } catch (error) {
              await fs.м('logs.txt', `Ошибка соединения у id ${id}\n`);
              console.log(`Ошибка соединения у id ${id}`);
            }
          } else {
            await fs.appendFile('logs.txt', `Проверка соединения у ${id}\n`);
            console.log(`Проверка соединения у ${id}`);
          }
        }, 8000);
      } catch (error) {
        await fs.appendFile('logs.txt', `Ошибка соединения у id вне setintervala ${id}\n`);
        console.log(`Ошибка соединения у id вне setintervala ${id}`);
      }
    } else {
      const timerUser = storage.getItem(`timer_${userJson.id}`);
      await fs.appendFile('logs.txt', 'Bot stop\n');
      console.log('Bot stop');
      clearInterval(timerUser);
    }
    res.json(botsJson);
  });

module.exports = router;
