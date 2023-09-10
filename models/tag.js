const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'tag',
    underscored: true,
  });
  Tag.associate = models => {
    Tag.belongsToMany(models.Lesson, { through: 'LessonTags', foreignKey: 'tagId' }); // Tag belongs to many Lesson
    Tag.belongsToMany(models.Author, { through: 'AuthorTags', foreignKey: 'tagId' }); // Tag belongs to many Author
    Tag.belongsToMany(models.Playlist, { through: 'PlaylistTags', foreignKey: 'tagId' }); // Tag belongs to many Playlist
  };
  return Tag;
};
