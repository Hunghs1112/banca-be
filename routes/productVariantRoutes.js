const express = require('express');
const router = express.Router();
const productVariantController = require('../controllers/productVariantController');

router.post('/products/:product_id/variants', productVariantController.createProductVariant);
router.get('/products/:product_id/variants', productVariantController.getProductVariants);
router.get('/products/:product_id/variants/:id', productVariantController.getProductVariantById);
router.put('/products/:product_id/variants/:id', productVariantController.updateProductVariant);
router.delete('/products/:product_id/variants/:id', productVariantController.deleteProductVariant);

module.exports = router;