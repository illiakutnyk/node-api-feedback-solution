const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../controllers/paramsValidation/auth');
const authCtrl = require('../controllers/auth.ctrl');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth - Returns token if correct username and password is provided */
router.route('/')
  .post(validate(paramValidation.login), authCtrl.login);

/** GET /api/auth - Returns user if valid token is provided */
router.route('/')
  .get(authCtrl.getUser);

/** DELETE /api/auth - Delete token which logout user */
router.route('/')
  .delete(authCtrl.logOut);


module.exports = router;
