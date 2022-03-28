const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const validator = require('validator');
const { getSaveMovie, createMovie, deleteMovie } = require('../controllers/controllersMovie');

router.get('/movies', getSaveMovie);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('не коректный url');
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('не коректный url');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('не коректный url');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.delete('/movies/:Id', celebrate({
  params: Joi.object().keys({
    Id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
