const faker = require('faker');
const request = require('supertest-as-promised');
const mongoose = require('mongoose');

const app = require('../../index');
const User = require('../models/user.model');
const Survey = require('../models/survey.model');

const defaultUser = {
  name: 'Default_User123',
  email: 'default_user@email.com',
  password: '123456'
};

async function saveUser(user = defaultUser) {
  try {
    const newUser = new User(user);

    await newUser.save();

    return newUser;
  } catch (err) {
    return console.error(err);
  }
}

async function loginUser(user = defaultUser) {
  try {
    const { email, password } = user;
    const agent = request.agent(app);
    await agent
      .post('/api/auth')
      .send({
        email,
        password
      });
    return agent;
  } catch (err) {
    return console.error(err);
  }
}

const defaultSurvey = {
  name: faker.lorem.words(3),
  questions: [
      { name: faker.lorem.words(), required: true },
      { name: faker.lorem.words(), required: false },
      { name: faker.lorem.words(), required: faker.random.boolean() }
  ]
};

async function saveRandomSurvey(user) {
  try {
    // eslint-disable-next-line new-cap
    const fakeUserId = mongoose.Types.ObjectId();

    const userId = user ? user._id : fakeUserId;

    const defaultSurveyObject = Object.assign(defaultSurvey, { createdBy: userId });

    const survey = new Survey(defaultSurveyObject);

    await survey.save();

    return survey;
  } catch (err) {
    return console.error(err);
  }
}

const createDataToChangeSurvey = (survey) => {
  const questionIds = survey.questions.map(q => q._id);

  const data = {
    name: faker.lorem.words(3),
    questions: [
      {
        _id: questionIds[0],
        name: faker.lorem.words(),
        required: false
      },
      {
        _id: questionIds[1],
        name: faker.lorem.words(),
        required: true
      }
    ]
  };

  return data;
};

module.exports = {
  defaultUser,
  defaultSurvey,
  saveUser,
  loginUser,
  saveRandomSurvey,
  createDataToChangeSurvey
};
