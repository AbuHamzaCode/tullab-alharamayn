const { body } = require('express-validator');
const models = require('../models');

const validateRoleCreate = [
    body('name')
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters.')
        .custom(async (value) => {
            const existingRole = await models.Role.findOne({ where: { name: value } });

            if (existingRole) {
                throw new Error('Role already exists');
            }
        }),
];

module.exports = {
    validateRoleCreate,
};
