const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-secret";
process.env.JWT_ACCESS_EXPIRATION_TTL = "3600";

test("generated JWT uses the explicit HS256 algorithm", () => {
  const generateToken = require("../src/auth/providers/generateToken.provider");
  const token = generateToken({ _id: "507f1f77bcf86cd799439011", email: "a@b.test", role: "user" });
  const header = jwt.decode(token, { complete: true }).header;
  assert.equal(header.alg, "HS256");
  assert.doesNotThrow(() => jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] }));
});

test("role middleware rejects non-admin users", async () => {
  const requireRole = require("../src/middleware/requireRole.middleware");
  let status;
  const res = { status(code) { status = code; return { json() {} }; } };
  requireRole("admin")({ user: { role: "user" } }, res, () => assert.fail("next should not run"));
  assert.equal(status, 403);
});
