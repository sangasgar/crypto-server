const { LinearClient } = require('bybit-api');
const { Users } = require('../db/models');

const useLivenet = true;

async function logicBybit() {
  const user = await Users.findOne({ where: { id: 1 } });
  const userJson = JSON.parse(JSON.stringify(user));
  const API_KEY = userJson.publicKey;
  const PRIVATE_KEY = userJson.privateKey;
  const BOT_STATUS = userJson.botStatus;
  console.log(BOT_STATUS);
  const client = new LinearClient(
    API_KEY,
    PRIVATE_KEY,

    // optional, uses testnet by default. Set to 'true' to use livenet.
    useLivenet,

  // restClientOptions,
  // requestLibraryOptions
  );
  client.getWalletBalance({ coin: 'ADA' })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.error(err);
    });
  client.getMarkPriceKline('BTCUSDT')
    .then((result) => {
      console.log(result.result);
    })
    .catch((err) => {
      console.error(err);
    });
}
module.exports = logicBybit;
