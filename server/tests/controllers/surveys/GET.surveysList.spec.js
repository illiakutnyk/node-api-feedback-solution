const httpStatus = require('http-status');
const chai = require('chai');

const expect = chai.expect;
const clearData = require('../../../helpers/cleanData');
const {
  saveUser,
  loginUser,
  saveRandomSurvey
} = require('../../../helpers/createTestData');

chai.config.includeStack = true;

let agent;
let user;

describe('# GET /api/surveys', () => {
  before(clearData);

  before(async() => {
    // create survey under another user
    await saveRandomSurvey();

    user = await saveUser();

    agent = await loginUser();
  });


  it('should not return any surveys because user didn\'t create any', async () => {
    await agent
      .get('/api/surveys')
      .expect(httpStatus.NO_CONTENT);
  });

  it('should return list of surveys created by user', async () => {
    const survey1 = await saveRandomSurvey(user);
    const survey2 = await saveRandomSurvey(user);

    const res = await agent
      .get('/api/surveys')
      .expect(httpStatus.OK);

    expect(res.body).to.be.an('array').to.have.lengthOf(2);
    expect(res.body[0].name).to.equal(survey1.name);
    expect(res.body[0].createdBy).to.equal(user._id.toString());
    expect(res.body[1].name).to.equal(survey2.name);
    expect(res.body[1].createdBy).to.equal(user._id.toString());
  });
});
