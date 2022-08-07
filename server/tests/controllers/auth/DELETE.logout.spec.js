const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');

const expect = chai.expect;
const app = require('../../../../index');
const clearData = require('../../../helpers/cleanData');
const { saveUser, defaultUser } = require('../../../helpers/createTestData');

chai.config.includeStack = true;

describe('# DELETE /api/auth', () => {
  before(clearData);

  before(saveUser);

  const agent = request.agent(app);

  const { email, password } = defaultUser;

  before(async () => {
    await agent
        .post('/api/auth')
        .send({
          email,
          password
        });
  });

  it('should delete jwt token from cookie', async () => {
    const res = await agent
      .delete('/api/auth')
      .expect(httpStatus.OK);

    const jwtValue = res.headers['set-cookie'][0].split(';')[0];
    expect(jwtValue).to.be.eq('jwt=');
  });
});
