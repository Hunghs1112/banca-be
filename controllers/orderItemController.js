// controllers/orderItemController.js
const { OrderItem } = require('../models');

module.exports = {
  createOrderItem: async (req, res) => {
    try {
      // Ví dụ: orderId, productId, quantity, price...
      const { orderId, productId, quantity, price } = req.body;
      const newOrderItem = await OrderItem.create({ orderId, productId, quantity, price });
      return res.status(201).json(newOrderItem);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllOrderItems: async (req, res) => {
    try {
      const orderItems = await OrderItem.findAll();
      return res.status(200).json(orderItems);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getOrderItemById: async (req, res) => {
    try {
      const { id } = req.params;
      const orderItem = await OrderItem.findByPk(id);
      if (!orderItem) {
        return res.status(404).json({ message: 'OrderItem không tồn tại' });
      }
      return res.status(200).json(orderItem);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  updateOrderItem: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await OrderItem.update(req.body, { where: { id } });
      if (!updated) {
        return res.status(404).json({ message: 'OrderItem không tồn tại' });
      }
      const updatedOrderItem = await OrderItem.findByPk(id);
      return res.status(200).json(updatedOrderItem);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  deleteOrderItem: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await OrderItem.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ message: 'OrderItem không tồn tại' });
      }
      return res.status(200).json({ message: 'Đã xoá OrderItem' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
