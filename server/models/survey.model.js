const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SurveySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

SurveySchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'survey'
});

module.exports = mongoose.model('Survey', SurveySchema);
