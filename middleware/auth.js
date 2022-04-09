const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { token } = req.cookies;

  // убеждаемся, что он есть
  if (!token) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    next(new AuthorizationError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
