const Card = require('../models/card');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

const getCards = (req, res, next) => Card.find()
  .then((cards) => {
    res.status(201).send(cards);
  })
  .catch((err) => {
    next(err);
  });

// Создание новой карточки
const createCard = (req, res, next) => {
  const id = req.user._id;
  const {
    name,
    link,
    likes,
  } = req.body;

  Card.create({
    name,
    link,
    owner: id,
    likes,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch(
      (err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
        } else {
          next(err);
        }
      },
    );
};

// Удаление карточки
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError('NotValid'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotValid') {
        next(new BadRequestError('Неправильный id'));
      } else {
        next(err);
      }
    });
};

// Лайк на карточку
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('DocumentNotFoundError'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else if (err.name === 'NotValid') {
        next(new BadRequestError('Неправильный id'));
      } else {
        next(err);
      }
    });
};

// Снятие лайка
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('NotValid'))
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else if (err.name === 'NotValid') {
        next(new BadRequestError('Неправильный id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
