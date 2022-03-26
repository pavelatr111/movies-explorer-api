const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getSaveMovie, createMovie, deleteMovie } = require('../controllers/controllersMovie');

router.get('/', getSaveMovie);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i),
    trailerLink: Joi.string().required().pattern(/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i),
    thumbnail: Joi.string().required().pattern(/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.required(), //! !!!!
  }),
}), createMovie);

router.delete('/:Id', celebrate({
  params: Joi.object().keys({
    Id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
