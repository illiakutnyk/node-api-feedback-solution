const httpStatus = require('http-status');
const chai = require('chai');
const mongoose = require('mongoose');

const expect = chai.expect;
const clearData = require('../../../helpers/cleanData');
const {
  defaultSurvey,
  saveUser,
  loginUser,
  createDataToChangeSurvey
} = require('../../../helpers/createTestData');

chai.config.includeStack = true;

let survey;
let agent;
let dataForChangeSurvey;

describe('# PUT /api/surveys/:id', () => {
  before(clearData);

  before(async() => {
    await saveUser();

    agent = await loginUser();

    survey = await agent
        .post('/api/surveys')
        .send(defaultSurvey);

    dataForChangeSurvey = createDataToChangeSurvey(survey.body);
  });


  it('should reject with unknown survey id', async () => {
    // eslint-disable-next-line new-cap
    const id = mongoose.Types.ObjectId();

    const res = await agent
      .put(`/api/surveys/${id}`)
      .send(dataForChangeSurvey)
      .expect(httpStatus.NOT_FOUND);

    expect(res.body.message).to.equal('No survey with such ID');
  });

  it('update survey and questions', async () => {
    const savedSurvey = survey.body;

    const res = await agent
      .put(`/api/surveys/${savedSurvey._id}`)
      .send(dataForChangeSurvey)
      .expect(httpStatus.OK);

    expect(res.body.name).to.equal(dataForChangeSurvey.name);
    expect(res.body.questions[0].name).to.equal(dataForChangeSurvey.questions[0].name);
    expect(res.body.questions[0].required).to.equal(dataForChangeSurvey.questions[0].required);
  });

  describe('# change user PUT /api/surveys/:id', () => {
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
        .put(`/api/surveys/${savedSurvey._id}`)
        .send(dataForChangeSurvey)
        .expect(httpStatus.FORBIDDEN);

      expect(res.body.message).to.equal('Only author can change survey');
    });
  });
});
