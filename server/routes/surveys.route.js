const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../controllers/paramsValidation/surveys');
const surveysCtrl = require('../controllers/surveys.ctrl');
const { authCheck } = require('../helpers/authCheck');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/surveys - Create new survey */
router.route('/')
  .post(authCheck, validate(paramValidation.create), surveysCtrl.create);

/** PUT /api/surveys/:id - Update survey and questions */
router.route('/:id')
  .put(authCheck, surveysCtrl.update);

/** GET /api/surveys - Get list of surveys created by user */
router.route('/')
  .get(authCheck, surveysCtrl.getList);

/** GET /api/surveys/:id - Get survey by id */
router.route('/:id')
  .get(authCheck, surveysCtrl.getSurvey);

/** GET /api/surveys/:id/answers - Get answers of surveys */
router.route('/:id/answers')
  .get(authCheck, surveysCtrl.getSurveyAnswers);

/** DELETE /api/surveys/:id - Delete survey by id */
router.route('/:id')
  .delete(authCheck, surveysCtrl.deleteSurvey);

module.exports = router;
