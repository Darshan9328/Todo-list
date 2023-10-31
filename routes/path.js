const express = require('express');
const router = express.Router();
const controller = require('./controller/item.js'); // Import your controller

// Define your routes using the router
router.get('/', homeRoute);

router.post('/', addItemRoute);

router.post('/delete', deleteItemRoute);

router.get('/:customListName', customListRoute);

module.exports = router; // Export the router
