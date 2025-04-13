// controllers/paymentController.js
const { Payment } = require('../models');

module.exports = {
  createPayment: async (req, res) => {
    try {
      // Ví dụ: orderId, amount, paymentMethod
      const { orderId, amount, paymentMethod } = req.body;
      const newPayment = await Payment.create({ orderId, amount, paymentMethod });
      return res.status(201).json(newPayment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      return res.status(200).json(payments);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getPaymentById: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findByPk(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment không tồn tại' });
      }
      return res.status(200).json(payment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  updatePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await Payment.update(req.body, { where: { id } });
      if (!updated) {
        return res.status(404).json({ message: 'Payment không tồn tại' });
      }
      const updatedPayment = await Payment.findByPk(id);
      return res.status(200).json(updatedPayment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  deletePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Payment.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ message: 'Payment không tồn tại' });
      }
      return res.status(200).json({ message: 'Đã xoá Payment' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
