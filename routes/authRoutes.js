const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const router = express.Router();

// Signup page and handling
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', signup);

// Login page and handling
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', login);

// Logout route
router.post('/logout', logout);

module.exports = router;
