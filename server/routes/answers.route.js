const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../controllers/paramsValidation/answer');
const answerCtrl = require('../controllers/answers.ctrl');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/answers - Create answers for survey */
router.route('/')
  .post(validate(paramValidation.create), answerCtrl.create);

module.exports = router;
