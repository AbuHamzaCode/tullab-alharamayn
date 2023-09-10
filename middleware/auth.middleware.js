const { body } = require('express-validator');
const models = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'thumbnails/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Rename files to avoid overwriting
    },
});

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 }, });

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
                throw new Error('Incorrect username or password.');
            }

            req.user = existingUser;
        }),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 1, max: 10 }).withMessage('Password must be between 1 and 10 characters.')
        .custom(async (value, { req }) => {

            if (!req.user) {
                throw new Error('Incorrect username or password.');
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
        .isLength({ min: 1, max: 100 }).withMessage('Full Name must be between 1 and 100 characters.'),
    upload.single('thumbnail'),
    body('thumbnail')
        .custom((value, { req }) => {
            if (!req.file) {
                return true;
            }

            // Check the file size (e.g., limit to 5MB)
            const maxSizeBytes = 5 * 1024 * 1024;
            if (req.file.size > maxSizeBytes) {
                throw new Error('File size exceeds the limit (5MB)');
            }

            // Check the file type (e.g., allow only images)
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw new Error('Invalid file type');
            }

            return true; // Validation passed
        }),
];

module.exports = {
    validateLogin,
    validateSignup,
};
