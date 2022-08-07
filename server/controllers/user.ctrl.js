const User = require('../models/user.model');
const httpStatus = require('http-status');
const _ = require('lodash');

/** POST /api/users */
async function create(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: 'User with this email already registered' });
    }

    const user = new User({
      name,
      email,
      password
    });

    const savedUser = await user.save();

    const resUser = _.pick(savedUser, ['_id', 'name', 'email']);

    return res.status(httpStatus.CREATED).send(resUser);
  } catch (e) {
    return next(e);
  }
}

module.exports = { create };
