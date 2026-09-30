const logger = require("./winston.helper.js");

function errorLogger(message, req, error) {
  logger.error(`${message}: ${error.message}`, {
    // Manually log the error
    metadata: {
      // You can add additional metadata if necessary
      //  These are logged to the error.log
      statusCode: error.code,
      errorName: error.name,
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      query: req.query,
      params: req.params,
      error: error,
    },
  });
}

module.exports = errorLogger;