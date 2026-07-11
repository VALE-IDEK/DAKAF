const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

const router = express.Router();

// Every route below requires a valid admin JWT
router.use(requireAdmin);

/* ---------- Categories ---------- */

// POST /api/admin/categories - create a category or subcategory
router.post('/categories', (req, res) => {
  const { name, parent_id } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  const info = db
    .prepare('INSERT INTO categories (name, parent_id) VALUES (?, ?)')
    .run(name.trim(), parent_id || null);

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ category });
});

// DELETE /api/admin/categories/:id
router.delete('/categories/:id', (req, res) => {
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

/* ---------- Products ---------- */

// POST /api/admin/products - create a product, optionally with an image upload
router.post('/products', upload.single('image'), (req, res) => {
  const { name, description, price, stock, category_id } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Product name and price are required.' });
  }

  const imageUrl = req.file ? req.file.path : null;

  const info = db
    .prepare(
      `INSERT INTO products (name, description, price, stock, image_url, category_id)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      name,
      description || '',
      parseFloat(price),
      parseInt(stock, 10) || 0,
      imageUrl,
      category_id || null
    );

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ product });
});

// PUT /api/admin/products/:id - update a product, optionally replacing the image
router.put('/products/:id', upload.single('image'), (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const {
    name = existing.name,
    description = existing.description,
    price = existing.price,
    stock = existing.stock,
    category_id = existing.category_id,
  } = req.body;

  const imageUrl = req.file ? req.file.path : existing.image_url;

  db.prepare(
    `UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category_id = ?
     WHERE id = ?`
  ).run(name, description, parseFloat(price), parseInt(stock, 10), imageUrl, category_id, req.params.id);

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json({ product });
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
