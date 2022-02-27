const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Поле name должно содержать минимум 2 сисмвола'],
    maxlength: [30, 'Поле name должно содержать максимум 30 сисмволов'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /(http:\/\/|https:\/\/)(www)*[a-z0-9\S]*/.test(v),
      message: 'Cсылка невалидна',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
