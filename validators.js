const { body } = require('express-validator');
const models = require('./models'); // Import your Sequelize models
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const validateLogin = [
    body('username')
        .notEmpty().withMessage('Username or Email is required.')
        .isLength({ min: 1, max: 100 }).withMessage('Username or Email must be between 1 and 100 characters.')
        .custom(async (value, { req }) => {
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

            req.user = existingUser;
        }),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 1, max: 10 }).withMessage('Password must be between 1 and 10 characters.')
        .custom(async (value, { req }) => {

            if (!req.user) {
                throw new Error('User does not exist.');
            }

            const passwordMatch = await bcrypt.compare(value, req.user.password);

            if (!passwordMatch) {
                throw new Error('Incorrect username or password.');
            }
        }),
];

const validateSignup = [
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
];

module.exports = {
    validateLogin,
    validateSignup,
};
