const fs = require('fs').promises;
/* eslint-disable max-len */
const storage = require('../storage/storage');
const cipherB = require('../indicators/cipherB');
const chandeTrendScore = require('../indicators/chandeTrendScore');
const bullTv = require('../indicators/bullTv');

const searchLastTime = (array, id) => {
  array.reverse();
  const arrayTime = [];
  for (let i = 0; i < array.length - 1; i += 1) {
    arrayTime.push(array[i].time);
  }
  storage.addItem(`arrayTime_${id}`, arrayTime);
  return arrayTime;
};

// async function lastPriceFunc(client, symbol) {
//   const priceBybit = await client.getTickers({ symbol });
//   // Получение данных о последней цене
//   const lastPrice = Number(priceBybit.result[0].last_price);
//   return lastPrice;
// }

function checkCandleShort(lowPriceCurrent, lowPriceLast, last, current, openPriceCurrent, highPriceCurrent) {
  if (lowPriceCurrent < lowPriceLast && last > current) {
    return true;
  }
  return false;
}
function checkCandleShort15Short(lowPriceCurrent, lowPriceLast, last, current, openPriceCurrent, highPriceCurrent) {
  if (lowPriceCurrent < lowPriceLast && last > current && openPriceCurrent >= highPriceCurrent) {
    return true;
  }
  return false;
}

function crossowerLast15mShort(array) {
  for (let i = 2; i < 3; i += 1) {
    if (array[i].vwap >= 0) {
      return true;
    }
  }
  return false;
}
function chandleTrendMfiVwapComparison15mShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent) {
  if ((vwapLogicLast > vwapLogic || mfLast > mf) && (lastScore > scoreCurrent || (lastScore === -10 && scoreCurrent === -10))) {
    return true;
  }
  return false;
}

function chandleTrendMfiVwapComparisonShort(vwapLogicCurrent, vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent) {
  if ((vwapLogicLast > vwapLogic > vwapLogicCurrent || mfLast > mf) && (lastScore > scoreCurrent || (lastScore === -10 && scoreCurrent === -10))) {
    return true;
  }
  return false;
}

function bw2FuncShort(bw2last, bw2Current) {
  if (bw2Current < bw2last && bw2Current > 13) {
    return true;
  }
  return false;
}
async function shortTrade6h(array) {
  array.reverse();
  const { mf } = array[0];
  const moneyflowLast = array[1].mf;
  const vwapLogicLast = array[1].vwap;
  const openPrice = array[0].open;
  const lastPrice = array[0].close;
  const vwapLogic = array[0].vwap;

  const openPriceCurrent = array[0].open;
  const openPriceLast = array[1].open;
  const closePriceCurrent = array[0].close;
  const closePriceLast = array[1].close;
  const lowPriceCurrent = array[0].low;
  const lowPriceLast = array[1].low;
  const highPriceCurrent = array[0].high;
  const highPriceLast = array[1].high;
  const last = closePriceLast - openPriceLast;
  const current = closePriceCurrent - openPriceCurrent;

  console.log('Время', array[0].time);
  console.log('Последняя цена', lastPrice);
  console.log('Цена открытия', openPrice);
  console.log('вивап цена', vwapLogic);
  console.log('мф цена', mf);
  console.log('мф предыдущие цена', moneyflowLast);
  // const vwapLogicLast = array[1].vwap;
  await fs.appendFile('logs.txt', `Время ${array[0].time}\n`);
  await fs.appendFile('logs.txt', `Последняя цена ${lastPrice}\n`);
  await fs.appendFile('logs.txt', `Цена открытия ${openPrice}\n`);
  await fs.appendFile('logs.txt', `вивап цена ${vwapLogic}\n`);
  await fs.appendFile('logs.txt', `мф цена ${mf}\n`);
  await fs.appendFile('logs.txt', `мф предыдущие цена ${moneyflowLast}\n`);
  await fs.appendFile('logs.txt', `openPriceCurrent цена ${openPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `openPriceLast предыдущая цена ${openPriceLast}\n`);
  await fs.appendFile('logs.txt', `closePriceCurrent цена ${closePriceCurrent}\n`);
  await fs.appendFile('logs.txt', `closePriceLast предыдущая цена ${closePriceLast}\n`);
  await fs.appendFile('logs.txt', `lowPriceCurrent цена ${lowPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `lowPriceLast цена ${lowPriceLast}\n`);
  await fs.appendFile('logs.txt', `highPriceCurrent предыдущая цена ${highPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `highPriceLast предыдущая цена ${highPriceLast}\n`);
  const candle = checkCandleShort(lowPriceCurrent, lowPriceLast, last, current, openPriceCurrent, highPriceCurrent);
  console.log('candle', candle);
  if (vwapLogic <= -0.1 && openPrice > lastPrice && candle === true && (vwapLogicLast > vwapLogic || moneyflowLast > mf)) {
    return true;
  }
  return false;
}

async function shortTrade2h(array, lastPriceCurrent) {
  array.reverse();
  const lastPrice = lastPriceCurrent;
  const openPrice = array[0].open;
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;

  const openPriceCurrent = array[0].open;
  const openPriceLast = array[1].open;
  const closePriceCurrent = array[0].close;
  const closePriceLast = array[1].close;
  const lowPriceCurrent = array[0].low;
  const lowPriceLast = array[1].low;
  const highPriceCurrent = array[0].high;
  const highPriceLast = array[1].high;

  const scoreCurrent = array[0].score;
  const lastScore = array[1].score;

  const bullLogicCurrent = Number(array[0].bullTV);

  const last = closePriceLast - openPriceLast;
  const current = closePriceCurrent - openPriceCurrent;

  console.log('Время', array[0].time);
  console.log('Последняя цена', lastPrice);
  console.log('Цена открытия', openPrice);
  console.log('вивап цена', vwapLogic);
  console.log('вивап предыдущая цена', vwapLogicLast);
  console.log('мф цена', mf);
  console.log('мф предыдущая цена', mfLast);
  console.log('bullLogicCurrent', bullLogicCurrent);
  await fs.appendFile('logs.txt', `Время ${array[0].time}\n`);
  await fs.appendFile('logs.txt', `Последняя цена ${lastPrice}\n`);
  await fs.appendFile('logs.txt', `Цена открытия ${openPrice}\n`);
  await fs.appendFile('logs.txt', `вивап цена ${vwapLogic}\n`);
  await fs.appendFile('logs.txt', `вивап предыдущая цена ${vwapLogicLast}\n`);
  await fs.appendFile('logs.txt', `мф цена ${mf}\n`);
  await fs.appendFile('logs.txt', `мф предыдущая цена ${mfLast}\n`);
  await fs.appendFile('logs.txt', `bullLogicCurrent  ${bullLogicCurrent}\n`);
  await fs.appendFile('logs.txt', `openPriceCurrent цена ${openPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `openPriceLast предыдущая цена ${openPriceLast}\n`);
  await fs.appendFile('logs.txt', `closePriceCurrent цена ${closePriceCurrent}\n`);
  await fs.appendFile('logs.txt', `closePriceLast предыдущая цена ${closePriceLast}\n`);
  await fs.appendFile('logs.txt', `lowPriceCurrent цена ${lowPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `lowPriceLast цена ${lowPriceLast}\n`);
  await fs.appendFile('logs.txt', `highPriceCurrent предыдущая цена ${highPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `highPriceLast предыдущая цена ${highPriceLast}\n`);
  const candle = checkCandleShort(lowPriceCurrent, lowPriceLast, last, current, openPriceCurrent, highPriceCurrent);
  const chandleTrendMfiVwapComparison2hShort = chandleTrendMfiVwapComparisonShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent);
  console.log('candle', candle);
  if (vwapLogic <= -3.5 && openPrice < lastPrice && chandleTrendMfiVwapComparison2hShort === true && bullLogicCurrent === 4) {
    return true;
  }
  return false;
}

async function shortTrade1h(array, lastPriceCurrent) {
  array.reverse();
  const lastPrice = lastPriceCurrent;
  const openPrice = array[0].open;
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  const scoreCurrent = array[0].score;
  const lastScore = array[1].score;

  const openPriceCurrent = array[0].open;
  const openPriceLast = array[1].open;
  const closePriceCurrent = array[0].close;
  const closePriceLast = array[1].close;
  const lowPriceCurrent = array[0].low;
  const lowPriceLast = array[1].low;
  const highPriceCurrent = array[0].high;
  const highPriceLast = array[1].high;
  const last = closePriceLast - openPriceLast;
  const current = closePriceCurrent - openPriceCurrent;

  const bullLogicCurrent = Number(array[0].bullTV);

  console.log('Время', array[0].time);
  console.log('Последняя цена', lastPrice);
  console.log('Цена открытия', openPrice);
  console.log('вивап цена', vwapLogic);
  console.log('вивап предыдущая цена', vwapLogicLast);
  console.log('мф цена', mf);
  console.log('мф предыдущая цена', mfLast);
  console.log('scoreCurrent цена', scoreCurrent);
  console.log('lastScore предыдущая цена', lastScore);
  console.log('bullLogicCurrent', bullLogicCurrent);
  await fs.appendFile('logs.txt', `Время ${array[0].time}\n`);
  await fs.appendFile('logs.txt', `Последняя цена ${lastPrice}\n`);
  await fs.appendFile('logs.txt', `Цена открытия ${openPrice}\n`);
  await fs.appendFile('logs.txt', `вивап цена ${vwapLogic}\n`);
  await fs.appendFile('logs.txt', `вивап предыдущая цена ${vwapLogicLast}\n`);
  await fs.appendFile('logs.txt', `мф цена ${mf}\n`);
  await fs.appendFile('logs.txt', `мф предыдущая цена ${mfLast}\n`);
  await fs.appendFile('logs.txt', `bullLogicCurrent  ${bullLogicCurrent}\n`);
  await fs.appendFile('logs.txt', `scoreCurrent цена ${scoreCurrent}\n`);
  await fs.appendFile('logs.txt', `lastScore предыдущая цена ${lastScore}\n`);
  await fs.appendFile('logs.txt', `openPriceCurrent цена ${openPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `openPriceLast предыдущая цена ${openPriceLast}\n`);
  await fs.appendFile('logs.txt', `closePriceCurrent цена ${closePriceCurrent}\n`);
  await fs.appendFile('logs.txt', `closePriceLast предыдущая цена ${closePriceLast}\n`);
  await fs.appendFile('logs.txt', `lowPriceCurrent цена ${lowPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `lowPriceLast цена ${lowPriceLast}\n`);
  await fs.appendFile('logs.txt', `highPriceCurrent предыдущая цена ${highPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `highPriceLast предыдущая цена ${highPriceLast}\n`);
  const candle = checkCandleShort(lowPriceCurrent, lowPriceLast, last, current, openPriceCurrent, highPriceCurrent);
  const chandleTrendMfiVwapComparison1hShort = chandleTrendMfiVwapComparisonShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent);
  console.log('candle', candle);
  if (vwapLogic <= -3 && openPrice < lastPrice && chandleTrendMfiVwapComparison1hShort === true && bullLogicCurrent === 4) {
    return true;
  }
  return false;
}

async function shortTrade15Last(array, lastPriceCurrent) {
  array.reverse();
  console.log('Предыдущие 15 минут', array[1].time);
  const vwapLogicLast = array[2].vwap;
  const vwapLogic = array[1].vwap;
  const vwapLogicCurrent = array[0].vwap;

  const lastPrice = lastPriceCurrent;
  const openPrice = array[0].open;

  const { mf } = array[1];
  const mfLast = array[2].mf;
  const scoreCurrent = array[1].score;
  const lastScore = array[2].score;
  const bw2Current = array[1].bw2;
  const bw2last = array[2].bw2;
  console.log('Время', array[1].time);
  console.log('Последняя цена', lastPrice);
  console.log('Цена открытия', openPrice);
  console.log('вивап цена', vwapLogic);
  console.log('вивап предыдущая цена', vwapLogicLast);
  console.log('мф цена', mf);
  console.log('мф предыдущая цена', mfLast);
  console.log('scoreCurrent цена', scoreCurrent);
  console.log('lastScore предыдущая цена', lastScore);

  const openPriceCurrent = array[1].open;
  const openPriceLast = array[2].open;
  const closePriceCurrent = array[1].close;
  const closePriceLast = array[2].close;
  const lowPriceCurrent = array[1].low;
  const lowPriceLast = array[2].low;
  const highPriceCurrent = array[1].high;
  const highPriceLast = array[2].high;
  const last = closePriceLast - openPriceLast;
  const current = closePriceCurrent - openPriceCurrent;
  const bullLogicCurrent = Number(array[1].bullTV);
  await fs.appendFile('logs.txt', `Время ${array[1].time}\n`);
  await fs.appendFile('logs.txt', `Последняя цена ${lastPrice}\n`);
  await fs.appendFile('logs.txt', `Цена открытия ${openPrice}\n`);
  await fs.appendFile('logs.txt', `вивап цена ${vwapLogic}\n`);
  await fs.appendFile('logs.txt', `вивап предыдущая цена ${vwapLogicLast}\n`);
  await fs.appendFile('logs.txt', `мф цена ${mf}\n`);
  await fs.appendFile('logs.txt', `мф предыдущая цена ${mfLast}\n`);
  await fs.appendFile('logs.txt', `scoreCurrent цена ${scoreCurrent}\n`);
  await fs.appendFile('logs.txt', `lastScore предыдущая цена ${lastScore}\n`);
  await fs.appendFile('logs.txt', `bw2Current ${bw2Current}\n`);
  await fs.appendFile('logs.txt', `bw2last ${bw2last}\n`);
  await fs.appendFile('logs.txt', `Кроссовер ${bw2FuncShort(bw2last, bw2Current)}\n`);

  await fs.appendFile('logs.txt', `openPriceCurrent цена ${openPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `openPriceLast предыдущая цена ${openPriceLast}\n`);
  await fs.appendFile('logs.txt', `closePriceCurrent цена ${closePriceCurrent}\n`);
  await fs.appendFile('logs.txt', `closePriceLast предыдущая цена ${closePriceLast}\n`);
  await fs.appendFile('logs.txt', `lowPriceCurrent цена ${lowPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `lowPriceLast цена ${lowPriceLast}\n`);
  await fs.appendFile('logs.txt', `highPriceCurrent предыдущая цена ${highPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `highPriceLast предыдущая цена ${highPriceLast}\n`);
  const candle = checkCandleShort(lowPriceCurrent, lowPriceLast, last, current, openPriceCurrent, highPriceCurrent);
  console.log('candle', candle);
  if (vwapLogic <= -3 && bullLogicCurrent === 4 && openPrice < lastPrice && bw2FuncShort(bw2last, bw2Current) && crossowerLast15mShort(array) && chandleTrendMfiVwapComparison15mShort(vwapLogicCurrent, vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent)) {
    return true;
  }
  return false;
}

async function shortTrade15(array, lastPriceCurrent) {
  array.reverse();
  const vwapLogic = array[0].vwap;
  const lastPrice = lastPriceCurrent;
  const openPrice = array[0].open;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  const scoreCurrent = array[0].score;
  const lastScore = array[1].score;
  const bw2Current = array[0].bw2;
  const bw2last = array[1].bw2;

  const openPriceCurrent = array[0].open;
  const openPriceLast = array[1].open;
  const closePriceCurrent = array[0].close;
  const closePriceLast = array[1].close;
  const lowPriceCurrent = array[0].low;
  const lowPriceLast = array[1].low;
  const highPriceCurrent = array[0].high;
  const highPriceLast = array[1].high;
  const last = closePriceLast - openPriceLast;
  const current = closePriceCurrent - openPriceCurrent;

  await fs.appendFile('logs.txt', `Время ${array[0].time}\n`);
  await fs.appendFile('logs.txt', `Последняя цена ${lastPrice}\n`);
  await fs.appendFile('logs.txt', `Цена открытия ${openPrice}\n`);
  await fs.appendFile('logs.txt', `вивап цена ${vwapLogic}\n`);
  await fs.appendFile('logs.txt', `вивап предыдущая цена ${vwapLogicLast}\n`);
  await fs.appendFile('logs.txt', `мф цена ${mf}\n`);
  await fs.appendFile('logs.txt', `мф предыдущая цена ${mfLast}\n`);
  await fs.appendFile('logs.txt', `scoreCurrent цена ${scoreCurrent}\n`);
  await fs.appendFile('logs.txt', `lastScore предыдущая цена ${lastScore}\n`);
  await fs.appendFile('logs.txt', `bw2Current ${bw2Current}\n`);
  await fs.appendFile('logs.txt', `bw2last ${bw2last}\n`);
  await fs.appendFile('logs.txt', `Кроссовер ${bw2FuncShort(bw2last, bw2Current)}\n`);

  await fs.appendFile('logs.txt', `openPriceCurrent цена ${openPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `openPriceLast предыдущая цена ${openPriceLast}\n`);
  await fs.appendFile('logs.txt', `closePriceCurrent цена ${closePriceCurrent}\n`);
  await fs.appendFile('logs.txt', `closePriceLast предыдущая цена ${closePriceLast}\n`);
  await fs.appendFile('logs.txt', `lowPriceCurrent цена ${lowPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `lowPriceLast цена ${lowPriceLast}\n`);
  await fs.appendFile('logs.txt', `highPriceCurrent предыдущая цена ${highPriceCurrent}\n`);
  await fs.appendFile('logs.txt', `highPriceLast предыдущая цена ${highPriceLast}\n`);
  const candle = checkCandleShort(lowPriceCurrent, lowPriceLast, last, current, openPriceCurrent, highPriceCurrent);
  console.log('candle', candle);
  if (vwapLogic <= -1 && openPrice > lastPrice && candle === true && bw2FuncShort(bw2last, bw2Current) && crossowerLast15mShort(array) && chandleTrendMfiVwapComparison15mShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent)) {
    return true;
  }
  return false;
}

function crossowerLast5mShort(array) {
  for (let i = 1; i < 4; i += 1) {
    if (array[i].vwap >= 0) {
      return true;
    }
  }
  return false;
}
function chandleTrendMfiVwapComparison5mShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent) {
  if ((vwapLogicLast > vwapLogic || mfLast > mf) && (lastScore > scoreCurrent || (lastScore === -10 && scoreCurrent === -10))) {
    return true;
  }
  return false;
}
async function shortTrade5mLast(array) {
  array.reverse();
  console.log('Предыдущие 5 минут', array[1].time);
  const lastPrice = array[1].close;
  const openPrice = array[1].open;
  const vwapLogic = array[1].vwap;
  const vwapLogicLast = array[2].vwap;
  const { mf } = array[1];
  const mfLast = array[2].mf;
  const scoreCurrent = array[1].score;
  const lastScore = array[2].score;
  const bw2Current = array[1].bw2;
  const bw2last = array[2].bw2;
  console.log('Шорт Время', array[1].time);
  console.log('Шорт Последняя цена', lastPrice);
  console.log('Шорт Цена открытия', openPrice);
  console.log('Шорт вивап цена', vwapLogic);
  console.log('Шорт вивап предыдущая цена', vwapLogicLast);
  console.log('Шорт мф цена', mf);
  console.log('Шорт мф предыдущая цена', mfLast);
  console.log('Шорт scoreCurrent цена', scoreCurrent);
  console.log('Шорт lastScore предыдущая цена', lastScore);
  console.log('Шорт bw2Current ', bw2Current);
  console.log('Шорт bw2last', bw2last);
  console.log('Шорт bw2 сравнение ', bw2FuncShort(bw2last, bw2Current));
  console.log('Шорт chandleTrendMfiVwapComparison5m ', chandleTrendMfiVwapComparison5mShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent));
  await fs.appendFile('logs.txt', `Время ${array[1].time}\n`);
  await fs.appendFile('logs.txt', `Последняя цена ${lastPrice}\n`);
  await fs.appendFile('logs.txt', `Цена открытия ${openPrice}\n`);
  await fs.appendFile('logs.txt', `вивап цена ${vwapLogic}\n`);
  await fs.appendFile('logs.txt', `вивап предыдущая цена ${vwapLogicLast}\n`);
  await fs.appendFile('logs.txt', `мф цена ${mf}\n`);
  await fs.appendFile('logs.txt', `мф предыдущая цена ${mfLast}\n`);
  await fs.appendFile('logs.txt', `scoreCurrent цена ${scoreCurrent}\n`);
  await fs.appendFile('logs.txt', `lastScore предыдущая цена ${lastScore}\n`);
  await fs.appendFile('logs.txt', `bw2Current ${bw2Current}\n`);
  await fs.appendFile('logs.txt', `bw2last ${bw2last}\n`);
  await fs.appendFile('logs.txt', `Кроссовер ${crossowerLast5mShort(array)}\n`);
  if ((vwapLogic <= -3.5 && vwapLogicLast > vwapLogic) || (vwapLogic <= -3.5 && mfLast > mf)) {
    return true;
  }
  return false;
}
async function shortTrade5m(array) {
  array.reverse();
  console.log('Текущие 5 минут', array[0].time);
  const lastPrice = array[0].close;
  const openPrice = array[0].open;
  const vwapLogic = array[0].vwap;
  const vwapLogicLast = array[1].vwap;
  const { mf } = array[0];
  const mfLast = array[1].mf;
  const scoreCurrent = array[0].score;
  const lastScore = array[1].score;
  const bw2Current = array[0].bw2;
  const bw2last = array[1].bw2;
  console.log('Шорт Время', array[0].time);
  console.log('Шорт Последняя цена', lastPrice);
  console.log('Шорт Цена открытия', openPrice);
  console.log('Шорт вивап цена', vwapLogic);
  console.log('Шорт вивап предыдущая цена', vwapLogicLast);
  console.log('Шорт мф цена', mf);
  console.log('Шорт мф предыдущая цена', mfLast);
  console.log('Шорт scoreCurrent цена', scoreCurrent);
  console.log('Шорт lastScore предыдущая цена', lastScore);
  console.log('Шорт bw2Current ', bw2Current);
  console.log('Шорт bw2last', bw2last);
  console.log('Шорт Кроссовер ', crossowerLast5mShort(array));
  console.log('Шорт bw2 сравнение ', bw2FuncShort(bw2last, bw2Current));
  console.log('Шорт chandleTrendMfiVwapComparison5m ', chandleTrendMfiVwapComparison5mShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent));
  await fs.appendFile('logs.txt', `Время ${array[0].time}\n`);
  await fs.appendFile('logs.txt', `Последняя цена ${lastPrice}\n`);
  await fs.appendFile('logs.txt', `Цена открытия ${openPrice}\n`);
  await fs.appendFile('logs.txt', `вивап цена ${vwapLogic}\n`);
  await fs.appendFile('logs.txt', `вивап предыдущая цена ${vwapLogicLast}\n`);
  await fs.appendFile('logs.txt', `мф цена ${mf}\n`);
  await fs.appendFile('logs.txt', `мф предыдущая цена ${mfLast}\n`);
  await fs.appendFile('logs.txt', `scoreCurrent цена ${scoreCurrent}\n`);
  await fs.appendFile('logs.txt', `lastScore предыдущая цена ${lastScore}\n`);
  await fs.appendFile('logs.txt', `bw2Current ${bw2Current}\n`);
  await fs.appendFile('logs.txt', `bw2last ${bw2last}\n`);
  await fs.appendFile('logs.txt', `Кроссовер ${crossowerLast5mShort(array)}\n`);
  if (vwapLogic <= -3.5 && openPrice > lastPrice && crossowerLast5mShort(array) && chandleTrendMfiVwapComparison5mShort(vwapLogicLast, vwapLogic, mfLast, mf, lastScore, scoreCurrent)) {
    return true;
  }
  return false;
}

async function shortTradeBybit(id, client, symbol, leverage, stoploss, sizeDeposit) {
  await fs.appendFile('logs.txt', '### ПОЗИЦИЯ ШОРТ ### \n');
  let getapikey = null;
  try {
    getapikey = await client.getApiKeyInfo();
  } catch (error) {
    console.log('Ошибка получения ключей');
  }
  try {
    if (getapikey.ret_msg === 'OK') {
      console.log(`Ключи подтверждены для id ${id} символ ${symbol}`);
      // Получение данных о балансе
      const balance = await client.getWalletBalance({ symbol });
      const balanceUSDT = Number(balance.result.USDT.available_balance);
      const shortDeposit = (balanceUSDT * sizeDeposit) / 100;
      console.log(`Баланс id ${id} символ ${symbol}`, balanceUSDT);
      console.log(`Сумма позиции id ${id} символ ${symbol}`, shortDeposit);
      await fs.appendFile('logs.txt', `Баланс id ${id} символ ${symbol} ${balanceUSDT}\n`);
      await fs.appendFile('logs.txt', `Сумма позиции id ${id} символ ${symbol} ${shortDeposit}\n`);
      const priceBybit = await client.getTickers({ symbol });
      // Получение данных о последней цене
      const lastPrice = Number(priceBybit.result[0].last_price);
      console.log(`Последняя цена id ${id} символ ${symbol}`, lastPrice);
      await fs.appendFile('logs.txt', `Последняя цена  id ${id} символ ${symbol} ${lastPrice}\n`);
      // Количество покупаемого актива
      const countActive = (shortDeposit / lastPrice).toFixed(3);
      console.log(`Количество актива_${id}_${symbol}`, countActive);
      await fs.appendFile('logs.txt', `Количество актива_${id}_${symbol} ${countActive}\n`);
      let stopLossRes = null;
      let stopLossTrade = null;
      if (countActive <= 1) {
        stopLossRes = (((stoploss * lastPrice) / 100) * countActive).toFixed(2);
      } else {
        stopLossRes = ((stoploss * lastPrice) / 100).toFixed(2);
      }
      console.log('Стоп лосс без учета кредитного плеча ', stopLossRes);
      await fs.appendFile('logs.txt', `Стоп лосс без учета кредитного плеча  ${stopLossRes}\n`);
      stopLossTrade = (lastPrice + stopLossRes / leverage).toFixed(2);
      // Расчет стоп-лоса
      console.log(`Стоп лосс id ${id} символ ${symbol}`, stopLossTrade);
      await fs.appendFile('logs.txt', `Стоп лосс id ${id} символ ${symbol}  ${stopLossTrade}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      await fs.appendFile('logs.txt', `Начало стратегии шорт 6 часов id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      const period6hData = storage.getItem(`period6hData_${id}_${symbol}`);
      const period6hDataCipherB = await cipherB(period6hData);
      const period6hDataChandeTrendScore = await chandeTrendScore(period6hData);
      const period6hDataCipherBwithTime = await period6hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period6hDataCipherB[0][i], bw2: period6hDataCipherB[1][i], vwap: period6hDataCipherB[2][i], mf: period6hDataCipherB[3][i], score: period6hDataChandeTrendScore[i],
      }));
      const array6H = period6hDataCipherBwithTime.filter((el, index) => index > period6hDataCipherBwithTime.length - 3);
      const period6Hresult = await shortTrade6h(array6H);
      await storage.addItem(`period6hShortBoolean_${id}_${symbol}`, period6Hresult);
      const time6h = Number(period6hDataCipherBwithTime[period6hDataCipherBwithTime.length - 1].time);
      const milliseconds6h = time6h * 1000;
      const dateObject6h = new Date(milliseconds6h);
      const humanDateFormat6h = dateObject6h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat6h);
      console.log(`Проверка входа на 6 часов для id ${id}`, storage.getItem(`period6hShortBoolean_${id}_${symbol}`));
      await fs.appendFile('logs.txt', '--------------\n');
      await fs.appendFile('logs.txt', `Начало стратегии шорт 2 часа id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      await fs.appendFile('logs.txt', `Время  ${humanDateFormat6h} \n`);
      await fs.appendFile('logs.txt', `Проверка входа на 6 часов для id ${id}\n`);
      const period2hData = storage.getItem(`period2hData_${id}_${symbol}`);
      const period2hDataCipherB = await cipherB(period2hData);
      const period2hDataBullTv = await bullTv(period2hData);
      const period2hDataChandeTrendScore = await chandeTrendScore(period2hData);
      const period2hDataCipherBwithTime = await period2hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period2hDataCipherB[0][i], bw2: period2hDataCipherB[1][i], vwap: period2hDataCipherB[2][i], mf: period2hDataCipherB[3][i], score: period2hDataChandeTrendScore[i], bullTV: period2hDataBullTv[i],
      }));
      const array2H = period2hDataCipherBwithTime.filter((el, index) => index > period2hDataCipherBwithTime.length - 3);
      const period2Hresult = await shortTrade2h(array2H, lastPrice);
      await storage.addItem(`period2hShortBoolean_${id}_${symbol}`, period2Hresult);
      const time2h = Number(period2hDataCipherBwithTime[period2hDataCipherBwithTime.length - 1].time);
      const milliseconds2h = time2h * 1000;
      const dateObject2h = new Date(milliseconds2h);
      const humanDateFormat2h = dateObject2h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat2h);
      console.log(`Проверка входа на 2 часов для id ${id}`, storage.getItem(`period2hShortBoolean_${id}_${symbol}`));
      await fs.appendFile('logs.txt', `Время  ${humanDateFormat2h} \n`);
      await fs.appendFile('logs.txt', `Проверка входа на 2 часа для id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      await fs.appendFile('logs.txt', `Начало стратегии шорт 1 час id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      const period1hData = storage.getItem(`period1hData_${id}_${symbol}`);
      const period1hDataCipherB = await cipherB(period1hData);
      const period1hDataBullTv = await bullTv(period1hData);
      const period1hDataChandeTrendScore = await chandeTrendScore(period1hData);
      const period1hDataCipherBwithTime = await period1hData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period1hDataCipherB[0][i], bw2: period1hDataCipherB[1][i], vwap: period1hDataCipherB[2][i], mf: period1hDataCipherB[3][i], score: period1hDataChandeTrendScore[i], bullTV: period1hDataBullTv[i],
      }));
      const array1H = period1hDataCipherBwithTime.filter((el, index) => index > period1hDataCipherBwithTime.length - 3);
      const period1Hresult = await shortTrade1h(array1H, lastPrice);
      await storage.addItem(`period1hShortBoolean_${id}_${symbol}`, period1Hresult);
      const time1h = Number(period1hDataCipherBwithTime[period1hDataCipherBwithTime.length - 1].time);
      const milliseconds1h = time1h * 1000;
      const dateObject1h = new Date(milliseconds1h);
      const humanDateFormat1h = dateObject1h.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat1h);
      console.log(`Проверка входа на 1 час для id ${id}`, storage.getItem(`period1hShortBoolean_${id}_${symbol}`));
      await fs.appendFile('logs.txt', `Время  ${humanDateFormat1h} \n`);
      await fs.appendFile('logs.txt', `Проверка входа на 1 час для id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      await fs.appendFile('logs.txt', `Начало стратегии шорт 15 минут id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      const period15Data = storage.getItem(`period15Data_${id}_${symbol}`);
      const period15DataCipherB = await cipherB(period15Data);
      const period15DataChandeTrendScore = await chandeTrendScore(period15Data);
      const period15DataCipherBwithTime = await period15Data.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period15DataCipherB[0][i], bw2: period15DataCipherB[1][i], vwap: period15DataCipherB[2][i], mf: period15DataCipherB[3][i], score: period15DataChandeTrendScore[i],
      }));
      console.log('Символ', symbol);
      const array15 = period15DataCipherBwithTime.filter((el, index) => index > period15DataCipherBwithTime.length - 10);
      const array15Last = period15DataCipherBwithTime.filter((el, index) => index > period15DataCipherBwithTime.length - 10);
      const period15result = await shortTrade15(array15, lastPrice);
      await storage.addItem(`period15ShortBoolean_${id}_${symbol}`, period15result);
      const time15 = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 1].time);
      const milliseconds15 = time15 * 1000;
      const dateObject15 = new Date(milliseconds15);
      const humanDateFormat15 = dateObject15.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat15);
      console.log(`Проверка входа на 15 минут для id ${id}`, storage.getItem(`period15ShortBoolean_${id}_${symbol}`));
      await fs.appendFile('logs.txt', `Время  ${humanDateFormat15} \n`);
      await fs.appendFile('logs.txt', `Проверка входа на 15 минут для id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      await fs.appendFile('logs.txt', `Начало стратегии шорт предыдущие 15 минут id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      const period15resultLast = await shortTrade15Last(array15Last, lastPrice);
      await storage.addItem(`period15ShortBooleanLast_${id}_${symbol}`, period15resultLast);
      const time15Last = Number(period15DataCipherBwithTime[period15DataCipherBwithTime.length - 2].time);
      const milliseconds15Last = time15Last * 1000;
      const dateObject15Last = new Date(milliseconds15Last);
      const humanDateFormat15Last = dateObject15Last.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat15Last);
      console.log(`Проверка входа на предыдущие 15 минут для id ${id}`, storage.getItem(`period15ShortBooleanLast_${id}_${symbol}`));
      await fs.appendFile('logs.txt', `Время  ${humanDateFormat15} \n`);
      await fs.appendFile('logs.txt', `Проверка входа на предыдущие 15 минут для id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      await fs.appendFile('logs.txt', `Начало стратегии шорт 5 минут id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      const period5mData = storage.getItem(`period5Data_${id}_${symbol}`);
      const period5mDataCipherB = await cipherB(period5mData);
      const period5mDataChandeTrendScore = await chandeTrendScore(period5mData);
      const period5mDataCipherBwithTime = await period5mData.map((el, i) => ({
        time: el.time, open: el.open, high: el.high, low: el.low, close: el.close, volume: el.volume, bw1: period5mDataCipherB[0][i], bw2: period5mDataCipherB[1][i], vwap: period5mDataCipherB[2][i], mf: period5mDataCipherB[3][i], score: period5mDataChandeTrendScore[i],
      }));
      console.log('Символ', symbol);
      const array5 = period5mDataCipherBwithTime.filter((el, index) => index > period5mDataCipherBwithTime.length - 10);
      const array5Last = period5mDataCipherBwithTime.filter((el, index) => index > period5mDataCipherBwithTime.length - 10);
      const period5mresult = await shortTrade5m(array5);
      await storage.addItem(`period5ShortBoolean_${id}_${symbol}`, period5mresult);
      const time5 = Number(period5mDataCipherBwithTime[period5mDataCipherBwithTime.length - 1].time);
      const milliseconds5 = time5 * 1000;
      const dateObject5 = new Date(milliseconds5);
      const humanDateFormat5 = dateObject5.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat5);
      console.log(`Проверка входа на 5 минут для id ${id}`, storage.getItem(`period5ShortBoolean_${id}_${symbol}`));
      await fs.appendFile('logs.txt', `Время  ${humanDateFormat5} \n`);
      await fs.appendFile('logs.txt', `Проверка входа на 5 минут для id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      await fs.appendFile('logs.txt', `Начало стратегии шорт предыдущие 5 минут id ${id}\n`);
      await fs.appendFile('logs.txt', '--------------\n');
      const period5mresultLast = await shortTrade5mLast(array5Last);
      await storage.addItem(`period5ShortBooleanLast_${id}_${symbol}`, period5mresultLast);
      const time5Last = Number(period5mDataCipherBwithTime[period5mDataCipherBwithTime.length - 2].time);
      const milliseconds5Last = time5Last * 1000;
      const dateObject5Last = new Date(milliseconds5Last);
      const humanDateFormat5Last = dateObject5Last.toLocaleString('ru-RU', { timeZoneName: 'short' });
      console.log('Время: ', humanDateFormat5Last);
      console.log(`Проверка входа на предыдущие 5 минут для id ${id}`, storage.getItem(`period5ShortBooleanLast_${id}_${symbol}`));
      await fs.appendFile('logs.txt', `Время  ${humanDateFormat5} \n`);
      await fs.appendFile('logs.txt', `Проверка входа на предыдущие 5 минут для id ${id}\n`);
      const short6hBoolean = storage.getItem(`period6hShortBoolean_${id}_${symbol}`);
      const short2hBoolean = storage.getItem(`period2hShortBoolean_${id}_${symbol}`);
      const short1hBoolean = storage.getItem(`period1hShortBoolean_${id}_${symbol}`);
      const short15Boolean = storage.getItem(`period15ShortBoolean_${id}_${symbol}`);
      const short15BooleanLast = storage.getItem(`period15ShortBooleanLast_${id}_${symbol}`);
      const short5Boolean = storage.getItem(`period5ShortBoolean_${id}_${symbol}`);
      const short5BooleanLast = storage.getItem(`period15ShortBooleanLast_${id}_${symbol}`);
      const arrayShortTime = period1hDataCipherBwithTime.filter((el, index) => index > period1hDataCipherBwithTime.length - 7);
      console.log('Логика входов 6 часов', short6hBoolean);
      console.log('Логика входов 2 часов', short2hBoolean);
      console.log('Логика входов 1 час', short1hBoolean);
      console.log('Логика входов 15 минут', short15Boolean);
      console.log('Логика входов предыдущие 15 минут', short15BooleanLast);
      console.log('Логика входов 5 минут', short5Boolean);
      console.log('Логика входов предыдущие 5 минут', short5BooleanLast);
      await fs.appendFile('logs.txt', `Логика входов шорт 6 часов  ${short6hBoolean} \n`);
      await fs.appendFile('logs.txt', `Логика входов шорт 2 часов  ${short2hBoolean} \n`);
      await fs.appendFile('logs.txt', `Логика входов шорт 1 час  ${short1hBoolean} \n`);
      await fs.appendFile('logs.txt', `Логика входов шорт 15 минут  ${short15Boolean} \n`);
      await fs.appendFile('logs.txt', `Логика входов шорт предыдущие 15 минут  ${short15BooleanLast} \n`);
      await fs.appendFile('logs.txt', `Логика входов шорт 5 минут  ${short5Boolean} \n`);
      await fs.appendFile('logs.txt', `Логика входов шорт предыдущие 5 минут  ${short5BooleanLast} \n`);
      if (short2hBoolean && short1hBoolean && short15BooleanLast) {
        console.log(`Проверка возможности входа в позицию для id ${id}`);
        await fs.appendFile('logs.txt', `Проверка возможности входа в позицию для id ${id} \n`);
        await client.setMarginSwitch({
          symbol, buy_leverage: leverage, sell_leverage: leverage, is_isolated: false,
        });
        const isIsolated = await client.setMarginSwitch({
          symbol, buy_leverage: leverage, sell_leverage: leverage, is_isolated: true,
        });
        if (isIsolated.ret_msg === 'OK') {
          const shortPosition = await client.placeActiveOrder({
            symbol, side: 'Sell', qty: countActive, order_type: 'Market', close_on_trigger: false, reduce_only: false, stop_loss: stopLossTrade, sl_trigger_by: 'LastPrice', time_in_force: 'ImmediateOrCancel',
          });
          console.log(shortPosition);
          await fs.appendFile('logs.txt', `Попытка открыта позицию шорт ${id} ${shortPosition} \n`);
          if (shortPosition.ret_msg === 'OK') {
            searchLastTime(arrayShortTime, id);
            await fs.appendFile('logs.txt', `Позиция шорт открыта для id ${id} \n`);
            console.log(`Позиция шорт открыта для id ${id}`);
            await storage.addItem(`positionEnter_${id}`, true);
          }
        }
      }
    } else {
      await fs.appendFile('logs.txt', `Ошибка верификации ключей на бирже для id ${id} \n`);
      console.log(`Ошибка верификации ключей на бирже для id ${id}`);
    }
  } catch (error) {
    await fs.appendFile('logs.txt', `Ошибка соединения  для id ${id} \n`);
    console.log(`Ошибка соединения  для id ${id}`);
  }
}
module.exports = shortTradeBybit;
