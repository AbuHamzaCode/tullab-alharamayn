const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const UserRole = sequelize.define('UserRole', {
    // Any additional columns you might need, e.g., 'createdAt', 'updatedAt'
  }, {
    tableName: 'userRole',
    underscored: true,
  });

  return UserRole;
};
