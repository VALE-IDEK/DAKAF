const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/categories - returns a flat list; client nests by parent_id
router.get('/', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  res.json({ categories });
});

module.exports = router;
