const bcrypt = require("bcrypt");
const User   = require("../users/users.schema.js");
const logger = require("../helpers/winston.helper.js");

// ── Default admin credentials ─────────────────────────────────────────
// Override via .env — never hardcode production credentials
const ADMIN_EMAIL     = process.env.ADMIN_EMAIL     || "admin@campus.com";
const ADMIN_PASSWORD  = process.env.ADMIN_PASSWORD  || "Admin@1234";
const ADMIN_FIRSTNAME = process.env.ADMIN_FIRSTNAME || "Campus";
const ADMIN_LASTNAME  = process.env.ADMIN_LASTNAME  || "Admin";

async function seedAdmin() {
  try {
    // Check if admin already exists — don't duplicate
    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      //logger.info(`Admin already exists: ${ADMIN_EMAIL}`);
      return;
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
      firstname: ADMIN_FIRSTNAME,
      lastname:  ADMIN_LASTNAME,
      email:     ADMIN_EMAIL,
      password:  hashed,
      role:      "admin",
      isBlocked: false,
    });

    logger.info(` Admin account created: ${ADMIN_EMAIL}`);

  } catch (error) {
    logger.error("❌ Failed to seed admin:", error.message);
  }
}

module.exports = seedAdmin;