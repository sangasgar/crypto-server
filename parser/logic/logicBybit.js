const { LinearClient } = require('bybit-api');
const { Users } = require('../db/models');

const useLivenet = false;

async function logicBybit() {
  const user = await Users.findOne({ where: { id: 1 } });
  const userJson = JSON.parse(JSON.stringify(user));
  console.log(userJson.publicKey);
  console.log(userJson.privateKey);
  const API_KEY = userJson.publicKey;
  const PRIVATE_KEY = userJson.privateKey;
  const BOT_STATUS = userJson.botStatus;
  console.log(BOT_STATUS);
  const restClientOptions = { recv_window: 10000 };
  const client = new LinearClient(
    API_KEY,
    PRIVATE_KEY,

    // optional, uses testnet by default. Set to 'true' to use livenet.
    useLivenet,

    restClientOptions,
  // requestLibraryOptions
  );

  client.getWalletBalance({ coin: 'USDT' }).then((result) => {
    console.log(result.result);
  })
    .catch((err) => {
      console.error(err);
    });
  client.setMarginSwitch({
    symbol: 'BTCUSDT', buy_leverage: 10, sell_leverage: 8, is_isolated: false,
  }).then((result) => {
    console.log(result);
    client.setMarginSwitch({
      symbol: 'BTCUSDT', buy_leverage: 10, sell_leverage: 15, is_isolated: true,
    }).then((result) => {
      console.log(result);
    });
  });
  //   .catch((err) => {
  //     console.error(err);
  //   });
  client.setMarginSwitch({
    symbol: 'BTCUSDT', buy_leverage: 30, sell_leverage: 30,
  }).then((result) => {
    console.log(result);
  });
  // client.placeActiveOrder({
  //   symbol: 'BTCUSDT', side: 'Sell', qty: 2.295, order_type: 'Market', close_on_trigger: false, reduce_only: false, stop_loss: 25717.5, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
  // }).then((result) => {
  //   console.log(result);
  // })
  //   .catch((err) => {
  //     console.error(err);
  //   });
  client.placeActiveOrder({
    symbol: 'BTCUSDT', side: 'Buy', qty: 2.295, order_type: 'Market', close_on_trigger: false, reduce_only: true, stop_loss: 20717.5, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
  }).then((result) => {
    console.log(result);
  })
    .catch((err) => {
      console.error(err);
    });

  // client.getPosition({
  //   symbol: 'BTCUSDT',
  // }).then((result) => {
  //   console.log(result);
  // })
  //   .catch((err) => {
  //     console.error(err);
  //   });
}
module.exports = logicBybit;
