// controllers/orderController.js
const { Order } = require('../models');

module.exports = {
  createOrder: async (req, res) => {
    try {
      // Ví dụ: userId, totalPrice, status
      const { userId, totalPrice, status } = req.body;
      const newOrder = await Order.create({ userId, totalPrice, status });
      return res.status(201).json(newOrder);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.findAll();
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Order không tồn tại' });
      }
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await Order.update(req.body, { where: { id } });
      if (!updated) {
        return res.status(404).json({ message: 'Order không tồn tại' });
      }
      const updatedOrder = await Order.findByPk(id);
      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Order.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ message: 'Order không tồn tại' });
      }
      return res.status(200).json({ message: 'Đã xoá Order' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
