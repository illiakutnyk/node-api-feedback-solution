const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  survey: {
    type: Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
