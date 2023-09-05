const Sequelize = require('sequelize');

const sequelize = new Sequelize('tullab_alharamayn', 'root', 'muvahhid*', {
  host: '127.0.0.1',
  dialect: 'mariadb',
  port: 3306,
  // logging: console.log,
});

module.exports = sequelize;
