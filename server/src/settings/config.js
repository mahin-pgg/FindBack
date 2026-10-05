const fs = require("fs");
const helmet = require("helmet");
const hpp = require("hpp");
// const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("../auth/auth.router.js");
const usersRouter = require("../users/users.router.js");
const itemRouter = require("../items/items.router.js");
const adminRouter = require("../admin/admin.router.js");
const matchRouter = require("../matches/matches.router.js");
const claimRouter = require("../claims/claims.router.js");
const responseFormatter = require("../middleware/responseFormatter.middleware.js");
const { StatusCodes } = require("http-status-codes");
const expressWinstonLogger = require("../middleware/expressWinston.middleware.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger.config.js");
const path = require("path");

function configureApp(app) {

app.use("/uploads", require("express").static(process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads")));
app.use(helmet());
app.use(hpp());
// app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));

// Use CORS
// Enabled for all origins
//app.use(cors());
// Only requests from example.com
// app.use(cors(corsOptions));

// Using Morgan for logging
/**
 * File System Module (fs): Used to create a writable stream for the file where logs will be saved.
 * Path Module (path): Helps with handling file paths.
 * Create Write Stream: fs.createWriteStream() is used to create a stream that Morgan will write log data to. The 'a' flag ensures that logs are appended to the file (access.log) instead of overwriting it.
 */



// CORS Configuration with Multiple Origins and Regex Support
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173").split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(new Error("Origin is required"));

    const isAllowed = allowedOrigins.includes(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));



var accessLogStream = fs.createWriteStream(
  //! The 'path.join' method joins all given path segments together using the platform-specific separator
  // '__dirname' is a Node.js variable that gives the directory name of the current module
  // '..' moves up one directory level from the current directory
  // 'access.log' is the file name we want to access or create in the parent directory
  // ! File is igniored in gitignore by default and need not be sent to git
  path.join(__dirname, "..", "access.log"),
  {
    flags: "a",
  }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Format Response
app.use(responseFormatter);

//  Winston Express Logger Middleware
app.use(expressWinstonLogger);

//  Defining Routes
app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/", itemRouter);
app.use("/", adminRouter);
app.use("/", matchRouter);
app.use("/", claimRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
console.log(swaggerSpecs);

// send back a 404 error for any unknown api request
// Sequence is important
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json(null);
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err.message);
  res.status(err.statusCode || 500).json({ message: "Internal server error" });
});

}

module.exports = configureApp;
