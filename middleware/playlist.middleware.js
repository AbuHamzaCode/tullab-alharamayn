const { body } = require('express-validator');
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

const validatePlaylistCreate = [
    body('title')
        .notEmpty().withMessage('Title is required.')
        .isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters.'),
    body('description')
        .isLength({ min: 1, max: 250 }).withMessage('Description must be between 1 and 250 characters.'),
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
    validatePlaylistCreate,
};
