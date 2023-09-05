const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const models = require('./models'); // Import your Sequelize models

const app = express();
const port = 8080;

app.use(cors());

// Middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Define your API routes here
app.use('/api/users', require('./routes/userRoutes')); 
app.use('/api/authors', require('./routes/authorRoutes')); 
app.use('/api/playlists', require('./routes/playlistRoutes')); 
app.use('/api/lessons', require('./routes/lessonRoutes')); 
app.use('/api/roles', require('./routes/roleRoutes')); 
app.use('/auth', require('./routes/authRoutes')); 

// Sync the database and start the server
models.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
