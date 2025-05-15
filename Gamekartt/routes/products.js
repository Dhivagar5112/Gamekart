const express = require('express');
const router = express.Router();
const db = require('../db');

// Product Listing (GET /products)
router.get('/', async (req, res) => {
    try {
        // Get products from the database
        const [results] = await db.promise().query('SELECT * FROM products');
        res.render('products', { products: results, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading products');
    }
});

// Product Details (GET /products/:id)
router.get('/:id', async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        
        res.render('product_detail', { product: results[0], user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading product details');
    }
});

// Admin Panel (GET /products/admin)
router.get('/admin', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login'); // Redirect to login if no session user
    }

    try {
        const [results] = await db.promise().query('SELECT * FROM products');
        res.render('admin_products', { products: results, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading admin panel');
    }
});

// Admin Add Product (POST /products/admin)
router.post('/admin', async (req, res) => {
    const { name, price, description } = req.body;

    try {
        await db.promise().query('INSERT INTO products (name, price, description) VALUES (?, ?, ?)', [name, price, description]);
        res.redirect('/products/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding product');
    }
});

module.exports = router;
