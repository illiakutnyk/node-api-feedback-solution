const httpStatus = require('http-status');

const Survey = require('../models/survey.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');

async function _loadSurvey(id) {
  const survey = await Survey
    .findById(id)
    .select('_id name createdBy')
    .lean()
    .populate({
      path: 'questions',
      select: '_id name required -survey'
    });
  return survey;
}

/** POST /api/surveys - Create new survey */
async function create(req, res, next) {
  try {
    const { body: { name, questions = [] }, authorizedUser } = req;

    const newSurvey = new Survey({
      name,
      createdBy: authorizedUser._id,
    });

    const survey = await newSurvey.save();

    for (const question of questions) {
      const newQuestion = new Question({
        name: question.name,
        required: question.required,
        survey: survey._id
      });
      await newQuestion.save();
    }

    const updatedSurvey = await _loadSurvey(survey._id);
    return res.status(httpStatus.CREATED).send(updatedSurvey);
  } catch (e) {
    return next(e);
  }
}

/** PUT /api/surveys/:id - Update survey and questions */
async function update(req, res, next) {
  try {
    const { params: { id }, body, authorizedUser } = req;

    const survey = await Survey.findOne({ _id: id });

    if (!survey) {
      return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: 'No survey with such ID' });
    }

    const isAuthorOfSurvey = survey.createdBy.toString() === authorizedUser._id;

    if (!isAuthorOfSurvey) {
      return res
      .status(httpStatus.FORBIDDEN)
      .send({ message: 'Only author can change survey' });
    }

    await Survey.updateOne({ _id: id }, {
      $set: body
    });

    if (body.questions) {
      for (const question of body.questions) {
        await Question.updateOne({ _id: question._id }, {
          $set: question
        });
      }
    }

    const updatedSurvey = await _loadSurvey(id);
    return res.status(httpStatus.OK).send(updatedSurvey);
  } catch (e) {
    return next(e);
  }
}

/** GET /api/surveys */
async function getList(req, res, next) {
  try {
    const surveys = await Survey
      .find({ createdBy: req.authorizedUser._id })
      .select('_id name createdBy')
      .lean()
      .populate({
        path: 'questions',
        select: '_id name required -survey'
      });

    if (!surveys.length) {
      return res
        .sendStatus(httpStatus.NO_CONTENT);
    }

    return res.status(httpStatus.OK).send(surveys);
  } catch (e) {
    return next(e);
  }
}

/** GET /api/surveys/:id */
async function getSurvey(req, res, next) {
  try {
    const { id } = req.params;

    const survey = await _loadSurvey(id);

    if (!survey) {
      return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: 'No survey with such ID' });
    }

    return res.status(httpStatus.OK).send(survey);
  } catch (e) {
    return next(e);
  }
}

/** GET /api/surveys/:id/answers */
async function getSurveyAnswers(req, res, next) {
  try {
    const { id } = req.params;

    const answers = await Answer.find({ survey: id }).select('createdAt _id data');

    return res.status(httpStatus.OK).send(answers);
  } catch (e) {
    return next(e);
  }
}

/** DELETE /api/surveys/:id */
async function deleteSurvey(req, res, next) {
  try {
    const { id } = req.params;
    const survey = await Survey.findOne({ _id: id });

    if (!survey) {
      return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: 'No survey with such ID' });
    }

    const isAuthorOfSurvey = survey.createdBy.toString() === req.authorizedUser._id;
    if (!isAuthorOfSurvey) {
      return res
      .status(httpStatus.FORBIDDEN)
      .send({ message: 'Only author can delete survey' });
    }

    await survey.deleteOne();
    await Question.deleteMany({ survey: id });

    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (e) {
    return next(e);
  }
}

module.exports = { create, update, getList, getSurvey, getSurveyAnswers, deleteSurvey };
