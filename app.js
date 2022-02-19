const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const users = require('./routes/users');
const cards = require('./routes/cards');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '620aaaa47c708a3a71700cde',
  };
  next();
});

app.use(express.json());
app.use(users);
app.use(cards);

// Обработки запросов на несуществующий роут
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`PORT ${PORT}`);
});
