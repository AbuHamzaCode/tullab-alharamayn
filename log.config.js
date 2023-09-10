const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Minimum log level to capture
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'error.log' }) // Log to file
  ]
});

module.exports = logger;
