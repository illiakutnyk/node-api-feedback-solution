const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../controllers/paramsValidation/user');
const userCtrl = require('../controllers/user.ctrl');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

module.exports = router;
