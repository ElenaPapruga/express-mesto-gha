const adminsRoutes = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');
const { createUser, signin } = require('../controllers/users');
const { signUpValidation, signInValidation } = require('../validation/auth');

adminsRoutes.post('/signup', signUpValidation, createUser);
adminsRoutes.post('/signin', signInValidation, signin);
adminsRoutes.use(auth);

adminsRoutes.use((req, res, next) => {
  next(new NotFoundError());
});

module.exports = adminsRoutes;
