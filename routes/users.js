const usersRouter = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const {
  updateUserValidation,
  updateAvatarValidation,
  getUserIdValidation,
} = require('../validation/users');

usersRouter.post('/users', createUser);
usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserIdValidation, getUser);
usersRouter.patch('/users/me', updateUserValidation, updateUser);
usersRouter.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = usersRouter;
