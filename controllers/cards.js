const Card = require('../models/card');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => res.status(500).send({ message: error.message }));
};

// Создание новой карточки
const createCard = (req, res) => {
  const id = req.user._id;
  const { name, link, likes } = req.body;

  Card.create({
    name,
    link,
    owner: id,
    likes,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch(
      (error) => {
        if (error.name === 'ValidationError') {
          next(new BadRequestError(`${Object.values(errer.errors).map((error) => error.message).join(', ')}`));
        } else {
          next(error);
        }
      },
    );
};

// Удаление карточки
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError('NotValid'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'NotValid') {
        next(new BadRequestError('Неправильный id'));
      } else {
        next(error);
      }
    });
};

// Лайк на карточку
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('DocumentNotFoundError'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else if (error.name === 'NotValid') {
        next(new BadRequestError('Неправильный id'));
      } else {
        next(error);
      }
    });
};

// Снятие лайка
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('NotValid'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      console.log(error);
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else if (error.name === 'NotValid') {
        next(new BadRequestError('Неправильный id'));
      } else {
        next(error);
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
