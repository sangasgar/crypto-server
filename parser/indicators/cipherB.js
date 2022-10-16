/* eslint-disable no-restricted-globals */
const tulind = require('tulind');
/* eslint-disable max-len */
const { promisify } = require('util');
const array = require('./data');

// useCurrentRes = input(true, "Use Current Chart Resolution?")
// customRes     = input.timeframe("60", "Use Current Chart Resolution?")
// obLevel1      = input(60, "Over Bought Level 1")
// trigger1      = input(53, "Trigger 1")
// osLevel1      = input(-60, "Over Sold Level 1")
// trigger2      = input(-53, "Trigger 2")

async function cipherB(arrayValue, timeframe, useCurrentRes = true, customRes = 60, obLevel1 = 60, trigger1 = 53, osLevel1 = -60, trigger2 = -53) {
  const emaAsync = promisify(tulind.indicators.ema.indicator);
  const smaAsync = promisify(tulind.indicators.sma.indicator);
  const o = [];
  const h = [];
  const l = [];
  const c = [];
  const v = [];
  arrayValue.forEach((element) => {
    o.push(element.open);
    h.push(element.high);
    l.push(element.low);
    c.push(element.close);
    v.push(element.volume);
  });
  const hlc3 = [];
  const mFcphl = [];
  for (let i = 0; i < h.length; i += 1) {
    hlc3.push((h[i] + l[i] + c[i]) / 3);
  }
  for (let i = 0; i < h.length; i += 1) {
    mFcphl.push(((c[i] - o[i]) / (h[i] - l[i])) * 200);
  }
  const blueWavesVwap = async (src = hlc3, src1 = mFcphl, chlLen = 9, avgLen = 12) => {
    const esaFunc = async (data, len) => {
      const results = await emaAsync([data], [len]);
      const d2 = results[0];
      return d2;
    };
    const dFunc = async (data, esahlc3, len) => {
      const resDataABSEsaHlc3 = [];
      for (let i = 0; i < data.length; i += 1) {
        resDataABSEsaHlc3.push(Math.abs(data[i] - esahlc3[i]));
      }
      const results = await emaAsync([resDataABSEsaHlc3], [len]);
      const d2 = results[0];
      return d2;
    };

    const ciFunc = (data, esa, d) => {
      const ci = [];
      for (let i = 0; i < data.length; i += 1) {
        let res = (data[i] - esa[i]) / (0.015 * d[i]);
        if (isNaN(res)) {
          res = 0;
        }
        ci.push(res);
      }
      return ci;
    };

    const bw1Func = async (data, len) => {
      const results = await emaAsync([data], [len]);
      const d2 = results[0];
      return d2;
    };
    const bw2Func = async (data, len) => {
      const results = await smaAsync([data], [len]);
      const countLen = data.length - results[0].length;

      const d2 = [...Array(countLen).fill(null), ...results[0]];
      return d2;
    };

    const vwapFunc = (data1, data2) => {
      const vwap = [];
      for (let i = 0; i < data1.length; i += 1) {
        vwap.push(data1[i] - data2[i]);
      }
      return vwap;
    };
    const moneyFlowFunc = async (arrayMf, period = 60, y = 2.25) => {
      const results = await smaAsync([arrayMf], [period]);
      const mfRes = [];
      const countLen = arrayMf.length - results[0].length;
      const mf = [...Array(countLen).fill(null), ...results[0]];
      for (let i = 0; i < array.length; i += 1) {
        mfRes.push((mf[i] - y));
      }
      return mfRes;
    };
    // esa = ta.ema(src, chlLen)
    const esa = await esaFunc(src, chlLen);
    // d = ta.ema(math.abs(src - esa), chlLen)
    const d = await dFunc(src, esa, chlLen);
    // ci = (src - esa) / (0.015 * d)
    const ci = ciFunc(src, esa, d);
    // bw1 = ta.ema(ci, avgLen)
    const bw1 = await bw1Func(ci, avgLen);
    // bw2 = ta.sma(bw1, 3);
    const bw2 = await bw2Func(bw1, 3);
    //  vwap = bw1 - bw2;
    const vwap = vwapFunc(bw1, bw2);
    //  moneyFlow = moneyFlow(period, mult, y) => ta.sma(((close - open) / (high - low)) * mult, period) - y
    const moneyFlow = await moneyFlowFunc(src1);

    return [bw1, bw2, vwap, moneyFlow];
  };
  const blueWavesV = await blueWavesVwap();
  return blueWavesV;
}

module.exports = cipherB;
