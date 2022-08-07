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

chai.config.includeStack = true;

let survey;
let agent;


describe('# GET /api/surveys/:id', () => {
  before(clearData);

  before(async() => {
    await saveUser();

    agent = await loginUser();

    survey = await agent
        .post('/api/surveys')
        .send(defaultSurvey);
  });


  it('should reject with unknown survey id', async () => {
    // eslint-disable-next-line new-cap
    const id = mongoose.Types.ObjectId();

    const res = await agent
      .get(`/api/surveys/${id}`)
      .expect(httpStatus.NOT_FOUND);

    expect(res.body.message).to.equal('No survey with such ID');
  });

  it('should return survey with question', async () => {
    const savedSurvey = survey.body;

    const res = await agent
      .get(`/api/surveys/${savedSurvey._id}`)
      .expect(httpStatus.OK);

    expect(res.body.name).to.equal(savedSurvey.name);
    expect(res.body.questions[0].name).to.equal(savedSurvey.questions[0].name);
    expect(res.body.questions[0].required).to.equal(savedSurvey.questions[0].required);
  });
});
