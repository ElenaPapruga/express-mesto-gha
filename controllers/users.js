const bcrypt = require('bcryptjs'); // хеширование пароля
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

// Метод вызова всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => res.status(500).send({ message: error.message }));
};

// Новый пользователь
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (password.length < 8) {
    res.status(400).send({ message: 'Пароль должен содержать как минимум 8 символов' });
  }

  // Хеширование пароля, соль = 10
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
        // Пользователь пытается зарегистрироваться по уже существующему в базе email
      } else if (err.code === 11000) {
        next(new ForbiddenError(`Ошибка. Пользователь c email:${email} уже существует`));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValid'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.message === 'NotValid') {
        res.status(404).send({ message: 'У пользователя другой id' });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  return User
    .findById(id)
    .orFail(new NotFoundError(`Ошибка. Пользователь с указанным id ${id} не найден`))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'NotValid') {
        next(new BadRequestError('Ошибка. Невалидный id'));
      } else {
        next(error);
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('DocumentNotFoundErrord'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.message === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Ошибка. У пользователя другой id' });
      } else if (error.name === 'ValidationError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: error.message });
      }
      return res.status(500).send({ message: error.message });
    });
};

// Авторизация пользователя
const signin = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOneByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7, // токен (jwt) существует неделю
          httpOnly: true,
          sameSite: true,
        })
        .send({ data: user.toJSON() });
    })
    .catch(next);
};

module.exports = {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  getUserById,
  createUser,
  signin,
};
