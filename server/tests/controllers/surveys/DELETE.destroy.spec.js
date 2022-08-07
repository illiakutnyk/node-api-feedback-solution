const httpStatus = require('http-status');
const chai = require('chai');
const mongoose = require('mongoose');

const expect = chai.expect;
const clearData = require('../../../helpers/cleanData');
const {
  defaultSurvey,
  saveUser,
  loginUser,
} = require('../../../helpers/createTestData');
const Survey = require('../../../models/survey.model');
const Question = require('../../../models/question.model');

chai.config.includeStack = true;

let survey;
let agent;


describe('# DELETE /api/surveys/:id', () => {
  before(clearData);

  before(async() => {
    await saveUser();

    agent = await loginUser();

    survey = await agent
        .post('/api/surveys')
        .send(defaultSurvey);
  });

  describe('# try as non author DELETE /api/surveys/:id', () => {
    before(async() => {
      const newUser = {
        name: 'New User',
        email: 'new_user@email.com',
        password: '1234567'
      };
      await saveUser(newUser);
      agent = await loginUser(newUser);
    });

    it('should reject because user not the author of survey', async () => {
      const savedSurvey = survey.body;
      const res = await agent
        .delete(`/api/surveys/${savedSurvey._id}`)
        .expect(httpStatus.FORBIDDEN);

      expect(res.body.message).to.equal('Only author can delete survey');
    });
  });


  describe('# try as author DELETE /api/surveys/:id', () => {
    before(async() => {
      agent = await loginUser();
    });
    it('should reject with unknown survey id', async () => {
      // eslint-disable-next-line new-cap
      const id = mongoose.Types.ObjectId();

      const res = await agent
        .delete(`/api/surveys/${id}`)
        .expect(httpStatus.NOT_FOUND);

      expect(res.body.message).to.equal('No survey with such ID');
    });

    it('should delete survey and questions', async () => {
      const savedSurvey = survey.body;

      await agent
        .delete(`/api/surveys/${savedSurvey._id}`)
        .expect(httpStatus.NO_CONTENT);

      const loadSurvey = await Survey.findById(savedSurvey._id);
      expect(loadSurvey).to.equal(null);
      const loadSurveyQuestions = await Question.find({ survey: savedSurvey._id });
      expect(loadSurveyQuestions).to.have.lengthOf(0);
    });
  });
});
