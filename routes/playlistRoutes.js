const express = require('express');
const router = express.Router();
const models = require('../models'); // Import your Sequelize models
const logger = require('../log');

// GET all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await models.Playlist.findAll(); // Include related models if needed
    logger.info('This is an informational log.', playlists);
    res.json(playlists);
  } catch (error) {
    // Example of using the logger
    logger.error('An error occurred:', error);

    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET playlist by id
router.get('/:id', async (req, res) => {
  try {
    const playlistId = req.params.id;
    const playlist = await models.Playlist.findByPk(playlistId, { include: models.Lesson });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST a new playlist
router.post('/', async (req, res) => {
  try {
    //add needed logic
  } catch (error) {
    //add needed error catching logic
  }
});

module.exports = router;