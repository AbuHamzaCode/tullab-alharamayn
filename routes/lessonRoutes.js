const express = require('express');
const router = express.Router();
const models = require('../models'); // Import your Sequelize models
const logger = require('../log');

// GET all lesson
router.get('/', async (req, res) => {
  try {
    const lessons = await models.Lesson.findAll({ include: models.Playlist }); // Include related models if needed
    logger.info('This is an informational log.', lessons);
    res.json(lessons);
  } catch (error) {
    logger.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET lesson  by id
router.get('/:id', async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await models.Lesson.findByPk(lessonId, {
      include: [
        {
          model: models.Playlist
        },
        {
          model: models.Author,
          through: {
            attributes: ['authorId'], // Exclude attributes from the join table (UserRole)
          },
        }
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST a new lesson
router.post('/', async (req, res) => {
  try {
    //add needed logic
  } catch (error) {
    //add needed error catching logic
  }
});


module.exports = router;