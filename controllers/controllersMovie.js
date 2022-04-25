const { Types: { ObjectId } } = require('mongoose');
const Movie = require('../models/modelsMovie');
const DataError = require('../errors/error-data');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getSaveMovie = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.status(200).send(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country, director, duration, year, description,
      image, trailerLink, nameRU, nameEN, thumbnail, movieId,
    } = req.body;
    const createMovie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
    res.status(200).send(createMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new DataError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports.deleteMovie = (req, res, next) => {
  const { Id } = req.params;
  Movie.findOne({ movieId: Id, owner: new ObjectId(req.user._id) }).orFail(() => new NotFoundError('Нет фильма по такому id'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Нельзя удалить фильм'));
      }
      return movie.remove()
        .then(() => res.send({ message: 'фильм удален' }));
    })
    .catch(next);
};
