const Joi = require('joi');

module.exports = {
  // POST /api/surveys
  create: {
    body: {
      name: Joi.string().required(),
      questions: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          required: Joi.boolean(),
        })
      )
    }
  },
  // PUT /api/surveys/:id
  update: {
    params: {
      id: Joi.string().trim().required()
    },
    body: {
      name: Joi.string(),
      questions: Joi.array().items(
        Joi.object({
          _id: Joi.string().trim().required(),
          name: Joi.string(),
          required: Joi.boolean(),
        })
      )
    }
  }
};
