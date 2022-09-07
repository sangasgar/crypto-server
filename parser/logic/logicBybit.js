const { LinearClient } = require('bybit-api');

const { API_KEY } = process.env;
const { PRIVATE_KEY } = process.env;
const useLivenet = true;

function logicBybit() {
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
