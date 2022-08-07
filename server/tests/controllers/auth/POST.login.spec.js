const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');

const expect = chai.expect;
const app = require('../../../../index');
const faker = require('faker');
const clearData = require('../../../helpers/cleanData');
const { saveUser, defaultUser } = require('../../../helpers/createTestData');

chai.config.includeStack = true;

describe('# POST /api/auth', () => {
  before(clearData);

  before(saveUser);

  it('should reject because user with this email doesn\'t exist', async () => {
    const fakeUser = {
      email: 'exampleTestUser@email.com',
      password: '123456'
    };

    const res = await request(app)
      .post('/api/auth')
      .send(fakeUser)
      .expect(httpStatus.NOT_FOUND);

    expect(res.body.message).to.equal('Cannot find user with this name');
  });

  it('should reject because of incorrect password', async () => {
    const user = {
      email: defaultUser.email,
      password: faker.internet.password()
    };

    const res = await request(app)
      .post('/api/auth')
      .send(user)
      .expect(httpStatus.BAD_REQUEST);

    expect(res.body.message).to.equal('Incorrect password');
  });

  it('should accept user credentials and login user', async () => {
    const { name, email, password } = defaultUser;

    const res = await request(app)
      .post('/api/auth')
      .send({
        email,
        password
      })
      .expect(httpStatus.OK);

    expect(res.body.name).to.equal(name);
    expect(res.body.email).to.equal(email);
  });
});
