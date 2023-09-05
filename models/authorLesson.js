const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const AuthorLesson = sequelize.define('AuthorLesson', {
    // Define any additional columns you might need in the join table
  }, {
    tableName: 'authorLesson',
    underscored: true,
  });

  return AuthorLesson;
};
