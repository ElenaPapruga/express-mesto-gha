require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const routes = require('./routes');

const { createUser, signin } = require('./controllers/users');

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

// const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/notFoundError');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cookieParser());
// app.use(routes);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.post('/signin', signin);
app.post('/signup', createUser);

app.use(errorHandler);
// Обработки запросов на несуществуюСВCDщий роут
app.use((res, req, next) => {
  next(new NotFoundError('Ошибка. Страница не существует'));
});

app.listen(PORT, () => {
  console.log(`Сервис запущен. Вы в безопасности. Порт: ${PORT}`);
});
