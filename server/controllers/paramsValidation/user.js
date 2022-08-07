const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      name: Joi.string().trim().required(),
      email: Joi.string().trim().required(),
      password: Joi.string().trim().min(5).required()
    }
  }
};
