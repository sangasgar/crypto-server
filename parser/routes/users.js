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
          const token = jwt.sign({ id: userJson.id, name: userJson.name, email: userJson.email }, process.env.TOKEN_SECRET, { expiresIn: '6h' });
          const user = {
            id: userJson.id, name: userJson.name, email: userJson.email, token,
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
    const { id, name, email } = req.body;

    if (id && name && email) {
      try {
        const userBd = await Users.update({ name, email }, { where: { id } });
        const userFind = await Users.findOne({ where: { id } });
        const userJson = JSON.parse(JSON.stringify(userFind));
        const token = jwt.sign({ id: userJson.id, name: userJson.name, email: userJson.email }, process.env.TOKEN_SECRET, { expiresIn: '6h' });
        const user = {
          id: userJson.id, name: userJson.name, email: userJson.email, token,
        };
        return res.json(user);
      } catch (error) {
        return res.json({ error: 'Connection error' });
      }
    }
    res.json({ error: 'not all fields are filled' });
  })
  .delete(async (req, res, next) => {
    const { id } = req.body;
    if (id) {
      try {
        const user = await Users.create({ where: id });
        await user.destroy();
        return res.sendStatus(200);
      } catch (error) {
        return res.json({ error: 'Connection error' });
      }
    }
    return res.json({ error: 'error id' });
  });
router.route('/register')
  .post(async (req, res, next) => {
    const { email, name, password } = req.body;
    if (email && name && password) {
      try {
        const userFind = await Users.findOne({ where: { email } });
        if (userFind) {
          return res.json({ error: 'User already register' });
        }
        const userReg = await Users.create({ email, name, password: await bcrypt.hash(password, Number(process.env.SALTROUNDS)) });
        const token = jwt.sign({ id: userReg.id, name: userReg.name, email: userReg.email }, process.env.TOKEN_SECRET, { expiresIn: '6h' });
        const userRegJson = JSON.parse(JSON.stringify(userReg));
        const user = {
          id: userRegJson.id, name: userRegJson.name, email: userRegJson.email, token,
        };
        return res.json(user);
      } catch (error) {
        return res.json({ error: 'Connection error' });
      }
    }
    return res.json({ error: 'not all fields are filled' });
  });
router.route('/check')
  .post(auth, (req, res) => {
    res.json(req.user);
  });
module.exports = router;
