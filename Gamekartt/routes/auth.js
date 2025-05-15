const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// Register Page
router.get('/register', (req, res) => {
    res.render('register', { message: req.flash('message') });
});

// Register Handler
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            req.flash('message', 'Error occurred.');
            return res.redirect('/auth/register');
        }
        if (results.length > 0) {
            req.flash('message', 'Email already exists!');
            return res.redirect('/auth/register');
        }

        const hash = bcrypt.hashSync(password, 10);
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], (err) => {
            if (err) {
                req.flash('message', 'Registration failed. Please try again.');
                return res.redirect('/auth/register');
            }
            req.flash('message', 'Registered successfully, please login.');
            res.redirect('/auth/login');
        });
    });
});

// Login Page
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('message') });
});

// Login Handler
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            req.flash('message', 'Invalid credentials!');
            return res.redirect('/auth/login');
        }

        const user = results[0];
        if (bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.redirect('/');
        } else {
            req.flash('message', 'Invalid credentials!');
            res.redirect('/auth/login');
        }
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
