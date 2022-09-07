/* eslint-disable max-len */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { Users } = require('../db/models');
const auth = require('../middleWare/auth');

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
      name, email, publicKey, privateKey, password,
    } = req.body;
    try {
      if (name) {
        await Users.update({ name }, { where: { id: 1 } });
      }
      if (email) {
        await Users.update({ email }, { where: { id: 1 } });
      }
      if (publicKey) {
        await Users.update({ publicKey }, { where: { id: 1 } });
      }
      if (privateKey) {
        await Users.update({ privateKey }, { where: { id: 1 } });
      }
      if (password) {
        await Users.update({ password: await bcrypt.hash(password, Number(process.env.SALTROUNDS)) }, { where: { id: 1 } });
      }
      const userFind = await Users.findOne({ where: { id: 1 } });
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
router.route('/check')
  .post(auth, (req, res) => {
    res.json(req.user);
  });
router.route('/bot-status')
  .put(async (req, res) => {
    const { botStatus } = req.body;
    try {
      await Users.update({ botStatus }, { where: { id: 1 } });
      const user = await Users.findOne({ where: { id: 1 } });
      const userJson = JSON.parse(JSON.stringify(user));
      res.json(userJson);
    } catch (error) {
      res.json({ error: 'connection error' });
    }
  });
router.route('/bot-status-check')
  .get(async (req, res) => {
    try {
      const user = await Users.findOne({ where: { id: 1 } });
      const userJson = JSON.parse(JSON.stringify(user));
      res.json(userJson);
    } catch (error) {
      res.json({ error: 'connection error' });
    }
  });
module.exports = router;
