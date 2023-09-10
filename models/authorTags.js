const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const AuthorTags = sequelize.define('AuthorTags', {
    // Define any additional columns you might need in the join table
  }, {
    tableName: 'authorTags',
    underscored: true,
  });

  return AuthorTags;
};
