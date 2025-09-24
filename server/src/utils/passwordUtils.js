const bcrypt = require("bcrypt");

// Generate a bcrypt hash for a password
async function genPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

// Validate a password against a stored hash
async function validPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = { validPassword, genPassword };
