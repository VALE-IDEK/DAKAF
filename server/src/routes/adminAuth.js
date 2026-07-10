const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);

  // Compare against a dummy hash even if admin not found, to avoid leaking
  // via response-time whether a username exists.
  const hashToCheck = admin ? admin.password_hash : '$2b$12$invalidsaltinvalidsaltinvalidsaltinvalidu';
  const valid = bcrypt.compareSync(password, hashToCheck);

  if (!admin || !valid) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign(
    { sub: admin.id, username: admin.username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, admin: { id: admin.id, username: admin.username } });
});

module.exports = router;
