const fs = require("fs");
const path = require("path");
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

function configureApp(app) {

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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  /\.app\.github\.dev$/,    // GitHub Codespaces
  /\.devtunnels\.ms$/,      // VS Code Dev Tunnels ← add this
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );

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

}

module.exports = configureApp;