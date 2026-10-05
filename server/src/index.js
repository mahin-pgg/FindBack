const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const configureApp = require("./settings/config.js");
const seedAdmin = require("./seeders/seedAdmin.js");

// Set the default environment
process.env.NODE_ENV = process.env.NODE_ENV || "development";

console.log(`Current Environment: ${process.env.NODE_ENV}`);

// Load environment variables
const envFile = `.env.${process.env.NODE_ENV}`;

console.log(`Loading environment variables from: ${envFile}`);

dotenv.config({ path: envFile });

if (!process.env.JWT_SECRET || !process.env.JWT_ACCESS_EXPIRATION_TTL) {
  throw new Error("JWT_SECRET and JWT_ACCESS_EXPIRATION_TTL are required");
}

const app = express();

const port = parseInt(process.env.PORT) || 3001;

// Parsing request body
app.use(express.json({ limit: "1mb" }));

configureApp(app);

async function bootstrap() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.DATABASE_URL,
      {
        dbName: process.env.DATABASE_NAME
      }
    );

    console.log("Connected To MongoDB");

    // Create default admin if it doesn't exist
    await seedAdmin();

    console.log("Admin seeding completed");

    // Start server only after MongoDB connection succeeds
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });

  } catch (error) {
    console.error("MongoDB connection/startup error:");
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
