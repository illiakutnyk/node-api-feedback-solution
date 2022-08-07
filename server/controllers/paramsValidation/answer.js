const Joi = require('joi');

module.exports = {
  // POST /api/answer
  create: {
    body: {
      surveyId: Joi.string().required(),
      data: Joi.object().required()
    }
  },
};
