const express = require('express');
const router = express.Router();
const db = require('../db');

// View Cart (becomes /cart/)
router.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    db.query(
        'SELECT c.id, p.name, p.price, c.quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
        [req.session.user.id],
        (err, results) => {
            if (err) {
                return res.send('Error loading cart');
            }
            res.render('cart', { cart: results });
        }
    );
});

// Add to Cart (becomes /cart/add/:id)
router.get('/add/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    db.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1',
        [req.session.user.id, req.params.id],
        (err) => {
            if (err) {
                return res.send('Error adding to cart');
            }
            res.redirect('/cart');
        }
    );
});

// Remove from Cart (becomes /cart/remove/:id)
router.get('/remove/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    db.query('DELETE FROM cart WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            return res.send('Error removing from cart');
        }
        res.redirect('/cart');
    });
});

module.exports = router;
