// controllers/addressController.js
const { Address, User } = require('../models');

const addressController = {
  // Tạo địa chỉ mới
  createAddress: async (req, res) => {
    try {
      const { userId, recipientName, addressLine, zipCode, city, country, phoneNumber, isDefault } = req.body;

      // Kiểm tra user tồn tại
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      // Nếu đặt là địa chỉ chính, bỏ chọn các địa chỉ chính khác
      if (isDefault) {
        await Address.update({ isDefault: false }, { where: { userId, isDefault: true } });
      }

      const newAddress = await Address.create({
        userId,
        recipientName,
        addressLine,
        zipCode,
        city,
        country,
        phoneNumber,
        isDefault: isDefault || false,
      });

      return res.status(201).json({
        message: 'Tạo địa chỉ thành công',
        address: newAddress,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Lấy danh sách địa chỉ của người dùng
  getAddressesByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const addresses = await Address.findAll({ where: { userId } });

      return res.status(200).json({
        message: 'Lấy danh sách địa chỉ thành công',
        addresses,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const { recipientName, addressLine, zipCode, city, country, phoneNumber, isDefault } = req.body;

      const address = await Address.findByPk(id);
      if (!address) {
        return res.status(404).json({ message: 'Địa chỉ không tồn tại' });
      }

      // Nếu đặt là địa chỉ chính, bỏ chọn các địa chỉ chính khác
      if (isDefault) {
        await Address.update({ isDefault: false }, { where: { userId: address.userId, isDefault: true } });
      }

      await address.update({
        recipientName,
        addressLine,
        zipCode,
        city,
        country,
        phoneNumber,
        isDefault: isDefault || false,
      });

      return res.status(200).json({
        message: 'Cập nhật địa chỉ thành công',
        address,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const address = await Address.findByPk(id);

      if (!address) {
        return res.status(404).json({ message: 'Địa chỉ không tồn tại' });
      }

      await address.destroy();

      return res.status(200).json({ message: 'Xóa địa chỉ thành công' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Đặt địa chỉ làm chính
  setDefaultAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const address = await Address.findByPk(id);

      if (!address) {
        return res.status(404).json({ message: 'Địa chỉ không tồn tại' });
      }

      // Bỏ chọn các địa chỉ chính khác
      await Address.update({ isDefault: false }, { where: { userId: address.userId, isDefault: true } });

      // Đặt địa chỉ này làm chính
      await address.update({ isDefault: true });

      return res.status(200).json({
        message: 'Đặt địa chỉ chính thành công',
        address,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = addressController;