const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');

const expect = chai.expect;
const app = require('../../../../index');
const clearData = require('../../../helpers/cleanData');
const { saveUser, defaultUser } = require('../../../helpers/createTestData');

chai.config.includeStack = true;

describe('# GET /api/auth', () => {
  before(clearData);

  before(saveUser);

  describe('# unauthorized GET /api/auth', () => {
    it('should reject without JWT token', async () => {
      await request(app)
        .get('/api/auth')
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('# authorized GET /api/auth', () => {
    const agent = request.agent(app);

    const { name, email, password } = defaultUser;

    before(async () => {
      await agent
        .post('/api/auth')
        .send({
          email,
          password
        });
    });

    it('should return user', async () => {
      const res = await agent
        .get('/api/auth')
        .expect(httpStatus.OK);

      expect(res.body.name).to.equal(name);
      expect(res.body.email).to.equal(email);
    });
  });
});
