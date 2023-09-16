const express = require('express');
const router = express.Router();
const models = require('../models'); // Import your Sequelize models
const logger = require('../log.config');
const { authenticateJWT, isTokenExpired } = require('../middleware/token.middleware');
const { validatePlaylistCreate } = require('../middleware/playlist.middleware');


// GET all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await models.Playlist.findAll();
    res.json(playlists);
  } catch (error) {
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
router.post('/create', authenticateJWT, isTokenExpired, validatePlaylistCreate, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(JSON.stringify(errors));
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newPlaylist = req.body;
    if (req.file) {
      newPlaylist.thumbnail = req.file.path;
    }
    console.log('playlist', newPlaylist) /** CHECK HERE TEST TEST TEST  TEST TEST******* */
    const createdPlaylist = await models.Playlist.create(newPlaylist);
    res.status(201).json(createdPlaylist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;