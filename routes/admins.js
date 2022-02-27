const adminsRoutes = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, signin } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');

adminsRoutes.post('/signup', createUser);
adminsRoutes.post('/signin', signin);
adminsRoutes.use('/auth', auth);

adminsRoutes.use((req, res, next) => {
  next(new NotFoundError());
});

module.exports = adminsRoutes;
