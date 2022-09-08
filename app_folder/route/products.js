'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-controller.js');
const authService = require('../services/auth-service.js');

router.get('/', controller.get);
router.get('/:slug', controller.getBySlug); /* dois parâmetros ex: router.get('/:slug/:title, controller.getBySlug); */
router.get('/admin/:id', controller.getById);
router.get('/tag/:tags', controller.getByTag);
router.post('/', authService.isAdmin, controller.post);
router.put('/:id', authService.isAdmin, controller.put)
router.delete('/:id', authService.isAdmin, controller.delete);
module.exports = router;