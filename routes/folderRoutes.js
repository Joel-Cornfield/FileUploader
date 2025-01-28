const express = require('express');
const { createFolder, getAllFolders } = require('../controllers/folderController');
const router = express.Router();

// Create folder route
router.post('/', createFolder);

// Get all folders route
router.get('/', getAllFolders);

module.exports = router;
