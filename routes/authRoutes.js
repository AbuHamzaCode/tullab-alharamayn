
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
router.post('/login', validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(JSON.stringify(errors));
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  try {
    const user = { id: req.user.id, username: username, email: req.user.email };
    const token = jsonWebToken.sign(user, process.env.SECRET_KEY, { expiresIn: '20h' });

    if (!token) {
      return res.status(401).json({ message: 'Authentication Failed!' })
    }

    return res.json({ status: 'success', token: token });
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
    logger.error(JSON.stringify(errors));
    return res.status(400).json({ errors: errors.array() });
  }
  
  /** Hashing password */
  let newUser = req.body;
  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  newUser.password = hashedPassword;

  /** Save user */
  try {
    const createdUser = await models.User.create(newUser);
    res.status(201).json({ status: "success", username: createdUser.username });
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