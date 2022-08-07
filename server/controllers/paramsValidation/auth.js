const Joi = require('joi');

module.exports = {
  // POST /api/auth
  login: {
    body: {
      email: Joi.string().trim().required(),
      password: Joi.string().trim().required()
    }
  }
};
