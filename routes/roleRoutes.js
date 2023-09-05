const express = require('express');
const router = express.Router();
const models = require('../models'); // Import your Sequelize models
const logger = require('../log');

// GET all roles
router.get('/', async (req, res) => {
  try {
    const roles = await models.Role.findAll(); // Include related models if needed
    logger.info('This is an informational log.', roles);
    res.json(roles);
  } catch (error) {
    logger.error('An error occurred:', error);

    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// get role by id
router.get('/:id', async (req, res) => {
  try {
    const roleId = req.params.id;
    const role = await models.Role.findByPk(roleId, {
      include: [
        {
          model: models.User,
          through: {
            attributes: ['userId'], // Exclude attributes from the join table (UserRole)
          },
        },
      ],
    });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // const users = await role.getUsers(); // Using 'getUsers' to handle the association
    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// POST a new user
router.post('/', async (req, res) => {
  try {
    //add needed logic
  } catch (error) {
    //add needed error catching logic
  }
});

module.exports = router;
