/* eslint-disable max-len */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { Users } = require('../db/models');
const { Bots } = require('../db/models');
const { Positions } = require('../db/models');
const { PositionsUsers } = require('../db/models');

const auth = require('../middleWare/auth');

router.route('/check')
  .post(auth, async (req, res) => {
    res.json(req.user);
  });
router.route('/')
  .get((req, res, next) => {
    res.sendStatus(200);
  })
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    if (email && password) {
      try {
        const userReg = await Users.findOne({ where: { email } });
        if (!userReg) {
          return res.json({ error: 'User not found' });
        }
        const userJson = JSON.parse(JSON.stringify(userReg));
        if (await bcrypt.compare(password, userJson.password)) {
          const token = jwt.sign({
            id: userJson.id, name: userJson.name, email: userJson.email, publicKey: userJson.publicKey, privateKey: userJson.privateKey,
          }, process.env.TOKEN_SECRET, { expiresIn: '6h' });
          const user = {
            id: userJson.id, name: userJson.name, email: userJson.email, publicKey: userJson.publicKey, privateKey: userJson.privateKey, token,
          };
          return res.json(user);
        }
      } catch (error) {
        return res.json({ error: 'Connection error' });
      }
    }
    return res.json({ error: 'wrong password' });
  })
  .put(async (req, res, next) => {
    const {
      id, name, email, publicKey, privateKey, password,
    } = req.body;
    try {
      if (name) {
        await Users.update({ name }, { where: { id } });
      }
      if (email) {
        await Users.update({ email }, { where: { id } });
      }
      if (publicKey) {
        await Users.update({ publicKey }, { where: { id } });
      }
      if (privateKey) {
        await Users.update({ privateKey }, { where: { id } });
      }
      if (password) {
        await Users.update({ password: await bcrypt.hash(password, Number(process.env.SALTROUNDS)) }, { where: { id } });
      }
      const userFind = await Users.findOne({ where: { id } });
      const userJson = JSON.parse(JSON.stringify(userFind));
      const token = jwt.sign({
        id: userJson.id, name: userJson.name, email: userJson.email, publicKey: userJson.publicKey, privateKey: userJson.privateKey,
      }, process.env.TOKEN_SECRET, { expiresIn: '6h' });
      const user = {
        id: userJson.id, name: userJson.name, email: userJson.email, publicKey: userJson.publicKey, privateKey: userJson.privateKey, token,
      };
      return res.json(user);
    } catch (error) {
      return res.json({ error: 'Connection error' });
    }
  });
router.route('/bot-status')
  .put(async (req, res) => {
    const { id } = req.body;
    const { botStatus } = req.body;
    try {
      await Bots.update({ botStatus }, { where: { user_id: id } });
      const bots = await Bots.findOne({ where: { user_id: id } });
      const botsJson = JSON.parse(JSON.stringify(bots));
      res.json(botsJson);
    } catch (error) {
      res.json({ error: 'connection error' });
    }
  });
router.route('/settings')
  .post(async (req, res) => {
    const { id } = req.body;
    try {
      const user = await Users.findOne({ where: { id }, include: Positions });
      const userJson = JSON.parse(JSON.stringify(user));
      res.json(userJson);
    } catch (error) {
      res.json({ error: 'connection error' });
    }
  })
  .get(async (req, res) => {
    try {
      const positions = await Positions.findAll();
      const positionsJson = JSON.parse(JSON.stringify(positions));
      res.json(positionsJson);
    } catch (error) {
      res.json({ error: 'connection error' });
    }
  })
  .put(async (req, res) => {
    const {
      id, symbols, leverage, sizeDeposit, stoploss,
    } = req.body;
    try {
      if (symbols) {
        await PositionsUsers.destroy({ where: { user_id: id } });
        symbols.map(async (el) => {
          await PositionsUsers.create({ user_id: id, position_id: el.symbolId });
        });
        return res.json({ update: true });
      }
      if (leverage) {
        await Users.update({ leverage }, { where: { id } });
        const user = await Users.findOne({ where: { id } });
        const userJson = JSON.parse(JSON.stringify(user));
        return res.json(userJson);
      }
      if (sizeDeposit) {
        await Users.update({ sizeDeposit }, { where: { id } });
        const user = await Users.findOne({ where: { id } });
        const userJson = JSON.parse(JSON.stringify(user));
        return res.json(userJson);
      }
      if (stoploss) {
        await Users.update({ stoploss }, { where: { id } });
        const user = await Users.findOne({ where: { id } });
        const userJson = JSON.parse(JSON.stringify(user));
        return res.json(userJson);
      }
      return res.json({ error: 'Database error' });
    } catch (error) {
      return res.json({ error: 'Database connection error' });
    }
  });
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
module.exports = router;
