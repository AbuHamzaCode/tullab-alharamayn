const express = require('express');
const router = express.Router();
const models = require('../models'); // Import your Sequelize models
const logger = require('../log');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await models.User.findAll(); // Include related models if needed
    logger.info('This is an informational log.', users);
    res.json(users);
  } catch (error) {
    logger.error('An error occurred:', error);

    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/** 
 * include -> add relation tables inside object
 * getRoles() => get all related roles separetly
*/

// GET  user by id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await models.User.findByPk(userId, {
      include: [
        {
          model: models.Role,
          through: {
            attributes: ['roleId'], // Exclude attributes from the join table (UserRole)
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // const roles = await user.getRoles(); // Using 'getRoles' to handle the association
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  try {
    const newUser = req.body;
    console.log('newUser', newUser)
    const createdUser = await models.User.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
