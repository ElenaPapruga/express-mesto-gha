const bcrypt = require('bcryptjs'); // хеширование пароля
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

// Метод вызова всех пользователей
const getUsers = (req, res, next) => User.find()
  .then((users) => {
    res.send(users);
  })
  .catch((err) => {
    next(err);
  });

// Новый пользователь
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  // Хеширование пароля, соль = 10
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
        // Пользователь пытается зарегистрироваться по уже существующему в базе email
      } else if (err.code === 11000) {
        next(new ForbiddenError(`Ошибка. Пользователь c указанным email: ${email} уже существует`));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValid'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Ошибка. Нет пользователя с указанным id' });
      } else {
        next(new BadRequestError('Ошибка. Невалидный id'));
        next(err);
      }
    });
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  return User
    .findById(id)
    .orFail(new NotFoundError(`Ошибка. Пользователь с указанным id: ${id} не найден`))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotValid') {
        next(new BadRequestError('Ошибка. Невалидный id'));
      } else {
        next(error);
      }
    });
};

// Обновленный пользователь
const updateUser = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('DocumentNotFoundErrord'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'DocumentNotFoundError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка. Невалидный id'));
      } else {
        next(err);
      }
    });
};

// Обновленный аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true, runValidators: true,
    },
  )
    .orFail(new NotFoundError(`Пользователь с указанным id: ${id} не найден`))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

// Авторизация пользователя (login)
const signin = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOneByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7, // такая кука будет храниться неделю - токен (jwt)
          httpOnly: true,
          sameSite: true,
        })
        .send({ data: user.toJSON() });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  getUserById,
  signin,
};
