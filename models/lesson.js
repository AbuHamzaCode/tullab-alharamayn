const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const Lesson = sequelize.define('Lesson', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    filesPath: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.BLOB('long'), // Binary data (e.g., for images)
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [1, 250] // Text length between 0 and 250 characters
      }
    }
  }, {
    tableName: 'lesson',
    underscored: true,
  });
  Lesson.associate = models => {
    Lesson.belongsTo(models.Playlist, { foreignKey: 'playlistId' }); // Lesson belongs to a Playlist
    Lesson.belongsToMany(models.Author, { through: 'AuthorLesson', foreignKey: 'lessonId' }); // Lesson belongs to many Authors
    Lesson.belongsToMany(models.Tag, { through: 'LessonTags', foreignKey: 'lessonId' }); // Lesson belongs to many Tags
  };

  // Add a custom toJSON method to convert table name keys to lowercase
  Lesson.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    for (const key in values) {
      if (key === 'Playlist' || key === "Authors") {
        let replacementLetter = key.charAt(0);
        values[key.replace(replacementLetter, replacementLetter.toLowerCase())] = values[key];
        delete values[key];
      }
    }
    return values;
  };


  return Lesson;
};
