const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login, logout } = require('../controllers/controllersUser');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().trim(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().trim(),
  }),
}), login);

router.post('/signout', logout);

module.exports = router;
