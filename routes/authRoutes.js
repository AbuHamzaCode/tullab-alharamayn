
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const models = require('../models'); // Import your Sequelize models
const { Op } = require('sequelize');
const logger = require('../log');

/** -------------NEXT IMPLEMENT THINGS ->
 *  BCRYPT (HASHING & VERIFYING) PASSWORD ->
 *  HASHING AFTER SUCCESS SIGNUP ->
 *  VERIFYING WHEN LOGIN --------------
 */

// Handle the login user
router.post('/login', [
  body('username')
    .notEmpty().withMessage('Username or Email is required.')
    .isLength({ min: 1, max: 100 }).withMessage('Username or Email must be between 1 and 100 characters.')
    .custom(async (value) => {
      /** 
       * -> Check if username is unique (you can define a function to check this)
       *  Exclude the current user (if editing) from the check.
       *  Assuming you have a 'params.id' with the user's ID
       *  id: { [Op.ne]: req.params.id },
      */
      const existingUser = await models.User.findOne({
        where: {
          [Op.or]: [
            { email: value },
            { username: value },
          ],
        },
      });
      if (!existingUser) {
        throw new Error('User does not exist.');
      }
    }),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 1, max: 10 }).withMessage('Password must be between 1 and 10 characters.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(JSON.stringify(errors));
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    req.session.isAuthenticated = true;
    req.session.username = username;
    return res.json({ status: 'success', username: username });
  } catch (error) {
    logger.error(JSON.stringify(error));
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Handle the signup user
router.post('/signup', [
  body('username')
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 1, max: 30 }).withMessage('Username must be between 1 and 30 characters.')
    .custom(async (value) => {
      const existingUser = await models.User.findOne({ where: { username: value } });
      if (existingUser) {
        throw new Error('Username is already taken.');
      }
    }),
  body('email').notEmpty().withMessage("Email is required.").custom(async (value) => {
    const existingUser = await models.User.findOne({ where: { email: value } });
    if (existingUser) {
      throw new Error('Email is already taken.');
    }
  }),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 1, max: 10 }).withMessage('Password must be between 1 and 10 characters.'),
  body('fullName')
    .notEmpty().withMessage('Full Name is required.')
    .isLength({ min: 1, max: 100 }).withMessage('Full Name must be between 1 and 100 characters.')
], async (req, res) => {
  /** if express-validator validation has error throw 400 status code with initialized messages above */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(JSON.stringify(errors));
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newUser = req.body;
    const createdUser = await models.User.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    logger.error(JSON.stringify(error));
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

// Define a logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login'); // Redirect to the login page after logging out
  });
});

module.exports = router;