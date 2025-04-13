const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItemController');

router.post('/', cartItemController.createCartItem); // POST /api/cart-items
router.post('/add', cartItemController.addCartItem); // POST /api/cart-items/add (used by ProductDetail.js)
router.get('/', cartItemController.getCartItemsByUserId); // GET /api/cart-items?userId=
router.get('/cart', cartItemController.getCartItemsByCartId); // GET /api/cart-items/cart?cartId=
router.get('/all', cartItemController.getAllCartItems); // GET /api/cart-items/all
router.put('/:id', cartItemController.updateCartItem); // PUT /api/cart-items/:id
router.delete('/:id', cartItemController.deleteCartItem); // DELETE /api/cart-items/:id

module.exports = router;