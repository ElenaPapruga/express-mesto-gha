const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  likeCard,
  deleteCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  createCardValidation,
  likeCardValidation,
  deleteCardValidation,
} = require('../validation/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCardValidation, createCard);
cardsRouter.put('/cards/:cardId/likes', likeCardValidation, likeCard);
cardsRouter.delete('/cards/:cardId', deleteCardValidation, deleteCard);
cardsRouter.delete('/cards/:cardId/likes', likeCardValidation, dislikeCard);

module.exports = cardsRouter;
