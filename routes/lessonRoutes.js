const express = require('express');
const router = express.Router();
const models = require('../models');
const logger = require('../log.config');
const multer = require('multer');
const { assembleFile } = require('../utils/helpers');

const upload = multer({
  storage: multer.memoryStorage(), // You can change the storage as needed
  limits: {
    fieldSize: 1024 * 1024 * 1024, // Increase field size limit (1 GB in this example)
    fileSize: 1024 * 1024 * 1024, // Increase file size limit (1 GB in this example)
  },
});
let uploadedChunks = []; // Store received chunks temporarily
let originalFilename;

// GET all lesson
router.get('/', async (req, res) => {
  try {
    const lessons = await models.Lesson.findAll({ include: models.Playlist });
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

router.post('/file-upload', upload.single('chunk'), async (req, res) => {
  const { chunk, chunkNumber, totalChunks, filename } = req.body;

  // Store the received chunk
  uploadedChunks[chunkNumber - 1] = { chunk, chunkNumber };

  console.log(`Received chunk ${chunkNumber} of ${totalChunks}`);


  // Store the original filename if not already set
  if (!originalFilename) {
    originalFilename = filename;
  }

  console.log(`uploadedChunks length: ${uploadedChunks.length}, totalChunks: ${totalChunks}`);
  // Check if all chunks have been received
  if (uploadedChunks.length === parseInt(totalChunks)) {
    console.log("All chunks received, total chunks:", totalChunks);
    // Assemble the file and save it to a permanent location
    await assembleFile(uploadedChunks, originalFilename);

    /** SAVE INTO DATABASE FILE URL */
    
    // Send a success response
    res.status(200).json({ message: 'File uploaded successfully' });
  } else {
    // Send a success response for the chunk received
    res.status(200).json({ message: `Chunk ${chunkNumber} received successfully` });
  }
});

module.exports = router;