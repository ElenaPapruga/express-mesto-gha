require('dotenv').config();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const UnauthorizedError = require('../errors/unauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Ошибка. Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
