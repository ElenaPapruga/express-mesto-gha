const router = require('express').Router();
const auth = require('../app');
const {
  createUser, signin,
} = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');

router.post('/signup', createUser);
router.post('/signin', signin);
router.use(auth);

router.use((_req, _res, next) => {
  next(new NotFoundError());
});

module.exports = router;
