const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Routes for cart management
router.post('/', cartController.createCart); // POST /api/carts
router.get('/', cartController.getCartByUserId); // GET /api/carts?userId=
router.get('/all', cartController.getAllCarts); // GET /api/carts/all
router.put('/:id', cartController.updateCart); // PUT /api/carts/:id
router.delete('/:id', cartController.deleteCart); // DELETE /api/carts/:id

module.exports = router;