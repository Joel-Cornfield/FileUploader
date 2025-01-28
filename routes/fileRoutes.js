const express = require('express');
const upload = require('../config/multerConfig');
const { uploadFile, getAllFiles, deleteFile } = require('../controllers/fileController');
const { isAuthenticated } = require('../controllers/authController');
const router = express.Router();

// Upload file route
router.post('/upload', upload.single('file'), uploadFile);

// Get all files route
router.get('/', isAuthenticated, getAllFiles); // Protect this route with authentication

// Delete a file
router.post('/delete/:id', deleteFile); // Route for file deletion

module.exports = router;
