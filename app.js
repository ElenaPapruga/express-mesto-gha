require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const {
  createUser,
  signin,
} = require('./controllers/users');

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const adminsRoutes = require('./routes/admins');

const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/notFoundError');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.use(auth);
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('/', adminsRoutes);

// Роут для логина и регистрации
app.post('/signin', signin);
app.post('/signup', createUser);

// Обработки запросов на несуществуюСВCDщий роут
app.use((res, req, next) => {
  next(new NotFoundError('Ошибка. Страница не существует'));
});

// Обработчик ошибок - celebrate
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервис запущен. Вы в безопасности. Порт: ${PORT}`);
});
