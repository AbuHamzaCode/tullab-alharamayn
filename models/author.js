const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const Author = sequelize.define('Author', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    thumbnail: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    },
    diploma: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 250]
      }
    }
  }, {
    tableName: 'author',
    underscored: true,
  });

  Author.associate = models => {
    Author.belongsToMany(models.Lesson, { through: 'AuthorLesson', foreignKey: 'authorId' }); // Author belongs to many Lessons
    Author.belongsToMany(models.Tag, { through: 'AuthorTags', foreignKey: 'authorId' }); // Author belongs to many Tags
  };

  // Add a custom toJSON method to convert table name keys to lowercase
  Author.prototype.toJSON = function () {
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

  return Author;
};
