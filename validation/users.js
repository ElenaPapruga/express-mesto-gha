const { celebrate, Joi } = require('celebrate');

// Валидация обновленного пользователя
module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

// Валидация обновленного аватара пользователя
module.exports.updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
});

module.exports.getUserIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(18),
  }),
});
