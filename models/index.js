const sequelize = require('../db.config');

const models = {
  User: require('./user')(sequelize),
  Role: require('./role')(sequelize),
  Tag: require('./tag')(sequelize),
  Playlist: require('./playlist')(sequelize),
  PlaylistTags: require('./playlistTags')(sequelize),
  Lesson: require('./lesson')(sequelize),
  LessonTags: require('./lessonTags')(sequelize),
  Author: require('./author')(sequelize),
  AuthorLesson: require('./authorLesson')(sequelize),
  AuthorTags: require('./authorTags')(sequelize),
  UserRole: require('./userRole')(sequelize),
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
