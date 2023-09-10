const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const PlaylistTags = sequelize.define('PlaylistTags', {
    // Define any additional columns you might need in the join table
  }, {
    tableName: 'playlistTags',
    underscored: true,
  });

  return PlaylistTags;
};
