const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { createUser } = require('../controllers/users');
const { signin } = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().required(),
    password: Joi.string().min(5).max(30).required()
      .messages({
        'string.min': 'Минимальная длинна поля 5 символов',
        'string.max': 'Максимальная длинна поля 30 символов',
        'any.required': 'Обязательное поле',
      }),
  }),
}), signin);

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().required(),
    password: Joi.string().min(5).max(30).required()
      .messages({
        'string.min': 'Минимальная длинна поля 5 символов',
        'string.max': 'Максимальная длинна поля 30 символов',
        'any.required': 'Обязательное поле',
      }),
  }),
}), createUser);

module.exports = router;
