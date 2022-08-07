const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const _ = require('lodash');


const config = require('../../config/config');
const User = require('../models/user.model');

/** POST /api/auth */
async function login(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: 'Cannot find user with this name' });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: 'Incorrect password' });
    }

    const token = jwt.sign({
      _id: user._id,
      name: user.name,
      email: user.email
    }, config.jwtSecret);

    res.cookie('jwt', token, { httpOnly: true });
    const formattedUser = _.pick(user, ['_id', 'name', 'email']);
    return res
      .status(httpStatus.OK)
      .send(formattedUser);
  } catch (e) {
    return next(e);
  }
}

/** GET /api/auth */
// eslint-disable-next-line consistent-return
async function getUser(req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (token) {
      return jwt.verify(token, config.jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(httpStatus.NOT_FOUND).send({ message: 'Incorrect validation token' });
        }
        const user = _.pick(decodedToken, ['name', 'email', '_id']);
        return res.status(httpStatus.OK).send(user);
      });
    }

    return res.sendStatus(httpStatus.UNAUTHORIZED);
  } catch (e) {
    return next(e);
  }
}

/** DELETE /api/auth */
function logOut(req, res, next) {
  try {
    res.clearCookie('jwt');
    return res.sendStatus(httpStatus.OK);
  } catch (e) {
    return next(e);
  }
}

module.exports = { login, getUser, logOut };
