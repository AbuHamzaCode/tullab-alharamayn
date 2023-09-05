const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const Playlist = sequelize.define('Playlist', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
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
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'playlist',
    underscored: true,
  });
  
  Playlist.associate = models => {
    Playlist.hasMany(models.Lesson, { foreignKey: 'playlistId' }); // Playlist has many Lessons
  };

  // Add a custom toJSON method to convert table name keys to lowercase
  Playlist.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    for (const key in values) {
      if (key === "Lessons") {
        let replacementLetter = key.charAt(0);
        values[key.replace(replacementLetter, replacementLetter.toLowerCase())] = values[key];
        delete values[key];
      }
    }
    return values;
  };

  return Playlist;
};
