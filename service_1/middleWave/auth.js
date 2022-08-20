const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ error: 'invalid token' });
      }
      req.user = { id: decoded.id, name: decoded.name, email: decoded.email };
      next();
    });
  }
}
module.exports = auth;
