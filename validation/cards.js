const { celebrate, Joi } = require('celebrate');
// Валидация создания карточки
module.exports.createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

// Валидация установки лайка
module.exports.likeCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(18),
  }),
});

// Валидация удаления карточки
module.exports.deleteCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(18),
  }),
});
