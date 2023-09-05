const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'role',
    underscored: true,
  });
  Role.associate = models => {
    Role.belongsToMany(models.User, { through: 'UserRole', foreignKey: 'roleId' });
  };

  // Add a custom toJSON method to convert table name keys to lowercase
  Role.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    for (const key in values) {
      if (key === 'Users') {
        let replacementLetter = key.charAt(0);
        values[key.replace(replacementLetter, replacementLetter.toLowerCase())] = values[key];
        delete values[key];
      }
    }
    return values;
  };

  return Role;
};
