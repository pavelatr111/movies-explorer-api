const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const generateJwt = (payload) => jwt.sign(
  payload,
  NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  { expiresIn: 3600000 * 24 * 7 },
);
module.exports = {
  generateJwt,
};
