const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const LessonTags = sequelize.define('LessonTags', {
    // Define any additional columns you might need in the join table
  }, {
    tableName: 'lessonTags',
    underscored: true,
  });

  return LessonTags;
};
