const express = require('express');
const router = express.Router();
const models = require('../models');
const logger = require('../log.config');
const multer = require('multer');
const fs = require("fs");
const { mergeChunks, formDataHandler } = require('../utils/helpers');
const { authenticateJWT, isTokenExpired } = require('../middleware/token.middleware');

const upload = multer({
  storage: multer.memoryStorage(), // You can change the storage as needed
  limits: {
    fieldSize: 1024 * 1024 * 1024, // Increase field size limit (1 GB in this example)
    fileSize: 1024 * 1024 * 1024, // Increase file size limit (1 GB in this example)
  },
});

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
router.post('/create', authenticateJWT, isTokenExpired, formDataHandler, async (req, res) => {
  try {
    const newUser = req.body;
    delete newUser.password;
    const createdUser = await models.User.create(newUser);
    res.status(201).json(createdUser);
    //add needed logic
  } catch (error) {
    //add needed error catching logic
  }
});

router.post("/file-upload", authenticateJWT, isTokenExpired, upload.single("file"), async (req, res) => {
  const chunk = req.file.buffer;
  const chunkNumber = Number(req.body.chunkNumber);
  const totalChunks = Number(req.body.totalChunks);
  const fileName = req.body.originalname;

  const chunkDir = "chunks"; // Directory to save chunks

  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir);
  }

  const chunkFilePath = `${chunkDir}/${fileName}.part_${chunkNumber}`;

  try {
    await fs.promises.writeFile(chunkFilePath, chunk);
    console.log(`Chunk ${chunkNumber}/${totalChunks} saved`);

    if (chunkNumber === totalChunks - 1) {
      // If this is the last chunk, merge all chunks into a single file
      let mergedFileURL = await mergeChunks(fileName, totalChunks);
      console.log("mergedFileURL", mergedFileURL);
      res.status(201).json({ message: "File merged successfully", filePath: mergedFileURL });
    } else {
      res.status(200).json({ message: "Chunk uploaded successfully" });
    }

  } catch (error) {
    console.error("Error saving chunk:", error);
    res.status(500).json({ error: "Error saving chunk" });
  }
});

module.exports = router;