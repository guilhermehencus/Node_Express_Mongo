'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/order-controller.js');
const authService = require('../services/auth-service.js');

router.get('/', authService.authorize , controller.get);
router.post('/', authService.authorize , controller.post);

module.exports = router;