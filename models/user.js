const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Поле name должно содержать минимум 2 сисмвола'],
    maxlength: [30, 'Поле name должно содержать максимум 30 сисмволов'],
    default: 'Жак-Ив Кусто',
    unique: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(v);
      },
      message: 'Ошибка. Невалидная ссылка на аватар в профиле',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Поле name должно содержать минимум 2 сисмвола'],
    maxlength: [30, 'Поле name должно содержать максимум 30 сисмволов'],
    default: 'Исследователь',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (event) => validator.isEmail(event),
      message: 'Неалидный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Поле name должно содержать минимум 8 сисмволов'],
    select: false, // API не возвращает хеш пароля
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Неправильная почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неправильный email или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
