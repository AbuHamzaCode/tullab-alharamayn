const { body } = require('express-validator');
const models = require('../models');

const validateTagCreate = [
    body('name')
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters.')
        .custom(async (value) => {
            const existingTag = await models.Tag.findOne({ where: { name: value } });

            if (existingTag) {
                throw new Error('Tag already exists');
            }
        }),
];

module.exports = {
    validateTagCreate,
};
