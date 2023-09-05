const express = require('express');
const router = express.Router();
const models = require('../models'); // Import your Sequelize models
const logger = require('../log');

// GET all users
router.get('/', async (req, res) => {
  try {
    const authors = await models.Author.findAll(); // Include related models if needed
    logger.info('This is an informational log.', authors);
    res.json(authors);
  } catch (error) {
    logger.error('An error occurred:', error);

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


router.get('/:id', async (req, res) => {
  try {
    const authorId = req.params.id;
    const author = await models.Author.findByPk(authorId, {
      include: [
        {
          model: models.Lesson,
          through: {
            attributes: ['lessonId'],
          },
        }
      ]
    });
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // const lessons = await author.getLessons(); // Using 'getLessons' to handle the association
    res.json(author);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;