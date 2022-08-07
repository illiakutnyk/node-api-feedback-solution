const httpStatus = require('http-status');
const chai = require('chai');

const expect = chai.expect;
const clearData = require('../../../helpers/cleanData');
const {
  defaultSurvey,
  saveUser,
  loginUser,
} = require('../../../helpers/createTestData');

chai.config.includeStack = true;

let agent;
let user;

describe('# POST /api/surveys', () => {
  before(clearData);

  before(async() => {
    user = await saveUser();

    agent = await loginUser();
  });

  it('should create survey', async () => {
    const res = await agent
      .post('/api/surveys')
      .send(defaultSurvey)
      .expect(httpStatus.CREATED);

    expect(res.body.name).to.equal(defaultSurvey.name);
    expect(res.body.createdBy).to.equal(user._doc._id.toString());
    expect(res.body.questions).to.be.an('array').to.have.lengthOf(3);
    expect(res.body.questions[0].name).to.equal(defaultSurvey.questions[0].name);
  });
});
