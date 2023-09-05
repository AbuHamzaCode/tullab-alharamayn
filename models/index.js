const sequelize = require('../db');

const models = {
  User: require('./user')(sequelize),
  Role: require('./role')(sequelize),
  Playlist: require('./playlist')(sequelize),
  Lesson: require('./lesson')(sequelize),
  Author: require('./author')(sequelize),
  AuthorLesson: require('./authorLesson')(sequelize),
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
