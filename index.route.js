const express = require('express');
const userRoutes = require('./server/routes/user.route');
const authRoutes = require('./server/routes/auth.route');
const surveysRoutes = require('./server/routes/surveys.route');
const answerRoutes = require('./server/routes/answers.route');

const router = express.Router(); // eslint-disable-line new-cap

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount surveys routes at /surveys
router.use('/surveys', surveysRoutes);

// mount answers routes at /answers
router.use('/answers', answerRoutes);

module.exports = router;
