const httpStatus = require('http-status');
const Answer = require('../models/answer.model');
const Survey = require('../models/survey.model');

/** POST /api/answers */
async function create(req, res, next) {
  const { surveyId, data } = req.body;
  try {
    const survey = await Survey
      .findById(surveyId)
      .lean()
      .populate('questions');

    if (!survey) {
      return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: 'Survey you tried to answer doesn\'t exist' });
    }

    const surveyQuestions = survey.questions;

    const errors = [];

    // validate questions ids
    const answerQuestionsIds = Object.keys(data);
    const surveyQuestionsIds = surveyQuestions.map(q => q._id.toString());
    answerQuestionsIds.forEach((question) => {
      if (!surveyQuestionsIds.includes(question)) {
        return errors.push(`question with id ${question} doesn't exist`);
      }
      return false;
    });


    // check if required questions answered
    const requiredQuestions = surveyQuestions.filter(q => q.required);
    if (requiredQuestions.length) {
      requiredQuestions.forEach((question) => {
        if (!data[question._id]) {
          return errors.push(`question ${question._id} is required`);
        }
        return false;
      });
    }

    if (errors.length) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: errors });
    }

    const answer = new Answer({
      survey: surveyId,
      createdAt: new Date(),
      data
    });

    const savedAnswer = await answer.save();

    return res.status(httpStatus.CREATED).send(savedAnswer);
  } catch (e) {
    return next(e);
  }
}

module.exports = { create };
