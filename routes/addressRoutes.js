// routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// API địa chỉ
router.post('/', addressController.createAddress); // Tạo địa chỉ mới
router.get('/user/:userId', addressController.getAddressesByUser); // Lấy danh sách địa chỉ
router.put('/:id', addressController.updateAddress); // Cập nhật địa chỉ
router.delete('/:id', addressController.deleteAddress); // Xóa địa chỉ
router.patch('/:id/default', addressController.setDefaultAddress); // Đặt làm địa chỉ chính

module.exports = router;