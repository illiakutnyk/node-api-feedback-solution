// const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');

const expect = chai.expect;
const app = require('../../../../index');
const faker = require('faker');
const clearData = require('../../../helpers/cleanData');
const { saveUser, defaultUser } = require('../../../helpers/createTestData');

chai.config.includeStack = true;

describe('# POST /api/users', () => {
  before(clearData);

  before(saveUser);

  it('should return status BAD REQUEST, because user with this email already registered.', async () => {
    const res = await request(app)
      .post('/api/users')
      .send(defaultUser)
      .expect(httpStatus.BAD_REQUEST);

    expect(res.body.message).to.equal('User with this email already registered');
  });

  it('should create a new user', async () => {
    const newUser = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const res = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(httpStatus.CREATED);

    expect(res.body.name).to.equal(newUser.name);
    expect(res.body.email).to.equal(newUser.email);
  });
});
