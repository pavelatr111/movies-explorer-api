const bcrypt = require('bcrypt');
const User = require('../models/modelsUser');
const { generateJwt } = require('../middleware/jwt');

const NotFoundError = require('../errors/not-found-error');
const DataError = require('../errors/error-data');
const ConflictError = require('../errors/conflict-error');
const AuthorizationError = require('../errors/authorized-error');

const saltRounds = 10;

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).send({ data: user });
    } else {
      next(new NotFoundError('Нет пользователя с таким id'));
    }
  } catch (err) {
    // if (err.name === 'CastError') {
    //   next(new DataError('Переданы некорректные id'));
    // } else {
    next(err);
  }
};
module.exports.updateUser = async (req, res, next) => {
  try {
    const userUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, email: req.body.email },
      { new: true, sctric: true, runValidators: true },
    );
    if (userUpdate) {
      res.status(200).send({ data: userUpdate });
    } else {
      next(new NotFoundError('Нет пользователя с таким id'));
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new DataError('Переданы некорректные данные'));
    } else if (err.name === 'CastError') {
      next(new DataError('Переданы некорректные id'));
    } else if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже зарегестрирован'));
    } else {
      next(err);
    }
  }
};
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  // if (!email || !password) {
  //   next(new AuthorizationError('Не верный email или пароль'));
  // }
  bcrypt.hash(password, saltRounds)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then(() => res.status(200)
          .send({
            data: {
              name, email,
            },
          }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new DataError('Переданы некорректные данные'));
          } else if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже зарегестрирован'));
          } else {
            next(err);
          }
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AuthorizationError('Не верный email или пароль'));
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user === null) {
        next(new AuthorizationError('Пользователь не найден'));
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new AuthorizationError('Не верный email или пароль'));
          }
          const token = generateJwt({ _id: user._id });
          res.cookie('token', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });
          res.status(200).send({ jwt: token });
        })
        .catch(() => next(new NotFoundError('Нет такова пользователя')));
    })
    .catch(() => next(new NotFoundError('Нет пользователя с таким id')));
};
module.exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.status(202).send('cookie cleared');
};
