const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/products?category=3 - list products, optionally filtered by category
router.get('/', (req, res) => {
  const { category } = req.query;

  let products;
  if (category) {
    products = db
      .prepare('SELECT * FROM products WHERE category_id = ? ORDER BY created_at DESC')
      .all(category);
  } else {
    products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  }

  res.json({ products });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ product });
});

module.exports = router;
