const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const models = require('../models');
const logger = require('../log.config');
const { authenticateJWT, isTokenExpired } = require('../middleware/token.middleware');
const { validateRoleCreate } = require('../middleware/role.middleware');


// GET all roles
router.get('/', authenticateJWT, isTokenExpired, async (req, res) => {
  try {
    const roles = await models.Role.findAll();
    res.json(roles);
  } catch (error) {
    logger.error('An error occurred:', error);

    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// get role by id
router.get('/:id', authenticateJWT, isTokenExpired, async (req, res) => {
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


// POST a new role
router.post('/create', authenticateJWT, isTokenExpired, validateRoleCreate, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(JSON.stringify(errors));
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newRole = req.body;
    const createdRole = await models.Role.create(newRole);
    res.status(201).json(createdRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
