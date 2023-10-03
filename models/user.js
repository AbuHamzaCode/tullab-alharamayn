const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const User = sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100]
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Requires unique username
      validate: {
        len: [0, 30]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Requires unique email
      validate: {
        isEmail: true // Validates as an email
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true // Default value for isAdmin
    },
    thumbnail: {
      type: DataTypes.BLOB('long'), // Binary data (e.g., for images)
      allowNull: true
    },
  }, {
    tableName: 'user',
    underscored: true,
  });

  User.associate = models => {
    User.belongsToMany(models.Role, { through: 'UserRole', foreignKey: 'userId' });
  };

  // Add a custom toJSON method to convert table name keys to lowercase
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    for (const key in values) {
      if (key === 'Roles') {
        let replacementLetter = key.charAt(0);
        values[key.replace(replacementLetter, replacementLetter.toLowerCase())] = values[key];
        delete values[key];
      }
    }
    return values;
  };

  return User;
};
