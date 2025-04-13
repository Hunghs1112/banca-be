// controllers/userController.js
const { User } = require('../models');

module.exports = {
  createUser: async (req, res) => {
    try {
      // Ví dụ: username, email, password...
      const { username, email, password } = req.body;
      const newUser = await User.create({ username, email, password });
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User không tồn tại' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await User.update(req.body, { where: { id } });
      if (!updated) {
        return res.status(404).json({ message: 'User không tồn tại' });
      }
      const updatedUser = await User.findByPk(id);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await User.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ message: 'User không tồn tại' });
      }
      return res.status(200).json({ message: 'Đã xoá User' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  signup: async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Kiểm tra nếu email đã tồn tại
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã được sử dụng' });
      }
  
      // Tạo user mới mà không mã hóa mật khẩu
      const newUser = await User.create({
        username,
        email,
        password, // Lưu mật khẩu dạng plain text
      });
  
      return res.status(201).json({
        message: 'Đăng ký thành công',
        user: {
          id: newUser.id,
          username: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Tìm user theo email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' });
      }
  
      // Kiểm tra mật khẩu mà không cần giải mã
      if (password !== user.password) {
        return res.status(401).json({ message: 'Mật khẩu không chính xác' });
      }
  
      return res.status(200).json({
        message: 'Đăng nhập thành công',
        user: {
          id: user.id,
          username: user.name, // Thêm username vào phản hồi
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};