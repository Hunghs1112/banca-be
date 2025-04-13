const { Cart } = require('../models');

module.exports = {
  // Create a new cart or return existing active cart
  createCart: async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'Thiếu userId' });

    try {
      let cart = await Cart.findOne({ where: { userId, status: 'active' } });
      if (cart) return res.status(200).json(cart);

      cart = await Cart.create({ userId, status: 'active' });
      return res.status(201).json(cart);
    } catch (error) {
      console.error('createCart error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Get all carts (admin use)
  getAllCarts: async (req, res) => {
    try {
      const carts = await Cart.findAll();
      return res.status(200).json(carts);
    } catch (error) {
      console.error('getAllCarts error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Get active cart by userId
  getCartByUserId: async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'Thiếu userId' });

    try {
      const cart = await Cart.findOne({ where: { userId, status: 'active' } });
      return res.status(200).json(cart || {});
    } catch (error) {
      console.error('getCartByUserId error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Update cart (e.g., status)
  updateCart: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const [updated] = await Cart.update({ status }, { where: { id } });
      if (!updated) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

      const updatedCart = await Cart.findByPk(id);
      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error('updateCart error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Delete cart
  deleteCart: async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await Cart.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

      return res.status(200).json({ message: 'Đã xóa giỏ hàng' });
    } catch (error) {
      console.error('deleteCart error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },
};