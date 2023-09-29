
const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const models = require('../models'); // Import your Sequelize models
const logger = require('../log.config');
const { validateLogin, validateSignup } = require('../middleware/auth.middleware');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const { authenticateJWT, isTokenExpired, expiredTokens } = require('../middleware/token.middleware');
const { formDataHandler } = require('../utils/helpers');

// Handle the login user
router.post('/login', formDataHandler, validateLogin, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorList = errors.array().map(val => ({ [val.path]: val.msg }))
    return res.status(400).json({ errors: errorList });
  }

  try {
    let sanitizedUser = { ...req.user.toJSON() };
    delete sanitizedUser.password;
    const token = jsonWebToken.sign(sanitizedUser, process.env.SECRET_KEY, { expiresIn: '20h' });
    if (!token) {
      return res.status(401).json({ message: 'Authentication Failed!' })
    }
    sanitizedUser = { ...sanitizedUser, token: token };
    return res.json({ status: 'success', message: "Successfully logged in.", user: sanitizedUser });
  } catch (error) {
    logger.error(JSON.stringify(error));
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Handle the signup user
router.post('/signup', formDataHandler, validateSignup, async (req, res) => {

  /** if validator given error, throw 400 status code with messages */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorList = errors.array().map(val => ({ [val.path]: val.msg }))
    return res.status(400).json({ errors: errorList });
  }

  /** Hashing password */
  let newUser = req.body;
  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  newUser.password = hashedPassword;

  /** Save user */
  try {
    const createdUser = await models.User.create(newUser);
    const sanitizedUser = { ...createdUser.toJSON() };
    delete sanitizedUser.password;

    res.status(201).json({ status: "success", user: sanitizedUser });
  } catch (error) {
    logger.error(JSON.stringify(error));
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

// Define a logout route
router.get('/logout', authenticateJWT, isTokenExpired, (req, res) => {

  const token = req.headers.authorization;
  expiredTokens.push(token);

  res.status(200).json({ status: 'success' })
});

module.exports = router;