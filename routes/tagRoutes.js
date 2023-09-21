const express = require('express');
const router = express.Router();
const models = require('../models');
const logger = require('../log.config');
const { isTokenExpired, authenticateJWT } = require('../middleware/token.middleware');
const { validateTagCreate } = require('../middleware/tag.middleware');

// GET all tag
router.get('/', async (req, res) => {
    try {
        const tags = await models.Tag.findAll();
        res.json(tags);
    } catch (error) {
        logger.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET tag  by id
router.get('/:id', async (req, res) => {
    try {
        const tagId = req.params.id;
        const tag = await models.Tag.findByPk(tagId);

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.json(tag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST a new tag
router.post('/create', authenticateJWT, isTokenExpired, validateTagCreate, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorList = errors.array().map(val => ({ [val.path]: val.msg }))
        return res.status(400).json({ errors: errorList });
      }

    try {
        const newTag = req.body;
        const createdTag = await models.Tag.create(newTag);
        res.status(201).json(createdTag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;