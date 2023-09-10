const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const models = require('./models');
require('dotenv').config({ path: '.env' });

const app = express();
const port = process.env.APP_PORT;

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Define API routes 
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/authors', require('./routes/authorRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/auth', require('./routes/authRoutes'));

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Invalid token..." });
  } else {
    next(err);
  }
});


// Sync the database and start the server
models.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
