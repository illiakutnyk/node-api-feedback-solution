const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  createdAt: {
    type: Date,
    required: true
  },
  survey: {
    type: Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  data: {
    type: JSON,
    required: true
  }
});

module.exports = mongoose.model('Answer', AnswerSchema);
