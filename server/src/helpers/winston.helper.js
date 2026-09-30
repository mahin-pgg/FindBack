const winston = require('winston');
const path = require('path');

/** 
  error (0)
  warn (1)
  info (2)
  verbose (3)
  debug (4)
  silly (5)
 */


const logger = winston.createLogger({
      //   winston.format.combine(): This function combines multiple formatting methods into a single formatter. Each formatter inside combine is applied in the order they are provided.
  // ! These are global format options that are applied to all logs
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // ! Adds a timestamp to each log entry

         // Allows custom formatting of log messages using a callback function where you can specify exactly how you want your log message to appear.
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`) // ! Customizes the log output format
    ),
    transports: [

         // Console transport with colorization
    // ! format options here are cusotisations to local transports
    // ! Common properties will override the global format settings new ones will be addon
        new winston.transports.Console({
            level: 'debug', // ! Minimum log level for console output
            format: winston.format.combine(
                winston.format.colorize(), // ! Adds color to console output based on log level
                winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`) // ! Customizes the log output format for console
            )
        }),
         // File transport for info level logs
    new winston.transports.File({
      filename: path.join(__dirname, "../..", "info.log"),
      level: "info", // This will log everything from 'info' and above
      format: winston.format.json(),
    }),
    // File transport for error level logs
    new winston.transports.File({
      filename: path.join(__dirname, "../..", "error.log"),
      level: "error", // This will log only 'error' level messages
      format: winston.format.json(),
    }),
    ]
    });


module.exports = logger;