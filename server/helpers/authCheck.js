const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const _ = require('lodash');

function authCheck(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, config.jwtSecret, (e, decodedToken) => {
      if (e) {
        const err = new APIError('Only for authorized users', httpStatus.FORBIDDEN, true);
        next(err);
      } else {
        // eslint-disable-next-line no-param-reassign
        req.authorizedUser = _.pick(decodedToken, ['name', 'email', '_id']);
        next();
      }
    });
  } else {
    const err = new APIError('Only for authorized users', httpStatus.FORBIDDEN, true);
    next(err);
  }
}

module.exports = { authCheck };
