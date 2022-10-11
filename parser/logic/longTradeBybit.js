async function longTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit) {
  const getapikey = await client.getApiKeyInfo();
  if (getapikey.ret_msg === 'OK') {
    console.log('Ключи подтверждены');
  } else {
    console.log('Ошибка верификации ключей на бирже');
  }
}
module.exports = longTradeBybit;
