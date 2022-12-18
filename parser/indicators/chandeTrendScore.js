/* eslint-disable max-len */

const tulind = require('tulind');
const { promisify } = require('util');
const array = require('./data');

async function chandeTrendScore(arr, period = 9) {
  const wmaAsync = promisify(tulind.indicators.wma.indicator);
  const c = [];
  arr.forEach((element) => {
    c.push(element.close);
  });
  const CTS = [];
  c.reverse();
  for (let i = 0; i < c.length; i += 1) {
    let res = c[i] > c[i + 11] ? 1 : -1;
    res += c[i] > c[i + 12] ? 1 : -1;
    res += c[i] > c[i + 13] ? 1 : -1;
    res += c[i] > c[i + 14] ? 1 : -1;
    res += c[i] > c[i + 15] ? 1 : -1;
    res += c[i] > c[i + 16] ? 1 : -1;
    res += c[i] > c[i + 17] ? 1 : -1;
    res += c[i] > c[i + 18] ? 1 : -1;
    res += c[i] > c[i + 19] ? 1 : -1;
    res += c[i] > c[i + 20] ? 1 : -1;
    CTS.push(res);
  }
  CTS.reverse();
  const results = await wmaAsync([CTS], [period]);
  const countLen = CTS.length - results[0].length;
  const res = [...Array(countLen).fill(null), ...results[0]];
  return res;
}
module.exports = chandeTrendScore;
