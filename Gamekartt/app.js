const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// Import routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Session and flash middleware
app.use(session({
    secret: 'gamekart_secret',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Middleware to expose session data and flash messages to views
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.message = req.flash('message');
    next();
});

// Use routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

// Optional: Redirect old /login to /auth/login
app.get('/login', (req, res) => {
    res.redirect('/auth/login');
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Home route
app.get('/', (req, res) => {
    res.render('index');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1>');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ GameKart running at http://localhost:${PORT}`);
});
