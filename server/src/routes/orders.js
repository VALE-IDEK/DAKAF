
const express = require('express');
const db = require('../db');

const router = express.Router();

// Blocks the request unless a Google-authenticated user session exists
function requireUser(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Sign in required.' });
  }
  next();
}

// POST /api/orders - save an order for the signed-in user (called at WhatsApp checkout)
router.post('/', requireUser, (req, res) => {
  const { items, total } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item.' });
  }

  const insertOrder = db.prepare(
    'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)'
  );
  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)'
  );

  const createOrder = db.transaction(() => {
    const info = insertOrder.run(req.user.id, total, 'pending');
    for (const item of items) {
      insertItem.run(info.lastInsertRowid, item.id, item.quantity, item.price);
    }
    return info.lastInsertRowid;
  });

  const orderId = createOrder();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  res.status(201).json({ order });
});

// GET /api/orders/my - the signed-in user's own order history, most recent first
router.get('/my', requireUser, (req, res) => {
  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);

  const itemsByOrder = db.prepare(
    `SELECT oi.*, p.name as product_name, p.image_url
     FROM order_items oi
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`
  );

  const withItems = orders.map((order) => ({
    ...order,
    items: itemsByOrder.all(order.id),
  }));

  res.json({ orders: withItems });
});

module.exports = router;
