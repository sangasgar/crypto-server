/* eslint-disable max-len */
const tulind = require('tulind');

const { promisify } = require('util');
const array = require('./data');

// price = input(hl2, title="Source")
// HMA_Length = input(21, 'HMA Length', type = input.integer);
// lookback = input(2, 'lookback', type = input.integer);
// ShowHullSupResLines = input(false, 'ShowHullSup/ResLines', type = input.bool);
// ShowBuySellArrows = input(false, 'ShowBuySellArrows', type = input.bool);
// ShowDivergenceLabel = input(false, 'ShowDivergenceLabel', type = input.bool);
// ExtendSupResLines = input(false, 'ExtendLocalSup/ResLines', type = input.bool);
const hmaAsync = promisify(tulind.indicators.hma.indicator);
async function bullTv(arrayValue, HMA_Length = 7, lookback = 1, ShowHullSupResLines = false, ShowBuySellArrows = false, ShowDivergenceLabel = false, ExtendSupResLines = false) {
  const h = [];
  const l = [];
  const o = [];
  const c = [];
  arrayValue.forEach((element) => {
    h.push(element.high);
    l.push(element.low);
    o.push(element.low);
    c.push(element.low);
  });
  const hloc2 = [];
  for (let i = 0; i < h.length; i += 1) {
    hloc2.push((h[i] + l[i] + o[i] + c[i]) / 4);
  }
  // HMA = hma(price, HMA_Length);
  const hmaFunc = async (data, len) => {
    const hma = await hmaAsync([data], [len]);
    const countLen = data.length - hma[0].length;

    const result = [...Array(countLen).fill(null), ...hma[0]];
    return result;
  };
  const deltaConcavity = (data, look) => {
    const result = [];
    for (let i = 0; i < data.length; i += 1) {
      // delta = HMA[1] - HMA[lookback + 1];
      let delta = data[i - 1] - data[i - (look + 1)];
      if (isNaN(delta)) {
        delta = 0;
      }
      const deltaPerBar = delta / look;
      const nextBar = data[i - 1] + deltaPerBar;
      // concavity = HMA > next_bar ? 1 : -1;
      // значения чисел/цветов
      // 1 - салатовый
      // 2 - темно-зеленый
      // 3 - оранжевый
      // 4 - красный
      const OR = data[i] > data[i - 1] ? 3 : 4;
      const DG_G = data[i] < data[i - 1] ? 2 : 1;
      const concavity = data[i] > nextBar ? 1 : -1;
      // plot(HMA, "HMA", color=concavity != -1 ? DG_G : O_R, linewidth=3)
      result.push(concavity !== -1 ? DG_G : OR);
    }
    return result;
  };

  const hma = await hmaFunc(hloc2, HMA_Length);
  const result = deltaConcavity(hma, lookback);
  return result;
}

module.exports = bullTv;

// // ————— Calculations
