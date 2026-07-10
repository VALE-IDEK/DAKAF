// One-time script: creates (or updates) the initial admin account.
// Run with: npm run seed:admin
// Reads credentials from .env - never hardcode passwords in source code.

require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./index');

const username = process.env.INITIAL_ADMIN_USERNAME;
const password = process.env.INITIAL_ADMIN_PASSWORD;

if (!username || !password) {
  console.error('Set INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD in server/.env first.');
  process.exit(1);
}

if (password === 'change-me-before-seeding') {
  console.error('Refusing to seed: please change INITIAL_ADMIN_PASSWORD in .env to a real password first.');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

const existing = db.prepare('SELECT id FROM admins WHERE username = ?').get(username);

if (existing) {
  db.prepare('UPDATE admins SET password_hash = ? WHERE username = ?').run(hash, username);
  console.log(`Updated password for existing admin "${username}".`);
} else {
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(username, hash);
  console.log(`Created admin "${username}".`);
}
