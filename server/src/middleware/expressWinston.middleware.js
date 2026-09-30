const expressWinston = require("express-winston");
const logger = require("../helpers/winston.helper.js");

const expressWinstonLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true, // Include metadata
  /**
   *! Meta Information: If meta is set to true, express-winston will log additional request and response metadata, which can include body, headers, etc., depending on configuration. This is why thwe below templating works
    This syntax is actually correct and functional when used within express-winston, which parses these placeholders and replaces them with actual values from the request and response objects.
   */
  msg: "HTTP {{req.method}} {{req.url}} responded with {{res.statusCode}} in {{res.responseTime}}ms",
  expressFormat: true, // Use the default Express/morgan request formatting
  colorize: true,
});

module.exports = expressWinstonLogger;