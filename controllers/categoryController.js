const { Category } = require('../models');

module.exports = {
  createCategory: async (req, res) => {
    try {
      const { name, parent_id } = req.body;
      if (!name) return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });

      if (parent_id) {
        const parent = await Category.findByPk(parent_id);
        if (!parent) return res.status(400).json({ message: 'Danh mục cha không tồn tại' });
      }

      const newCategory = await Category.create({ name, parent_id });
      return res.status(201).json(newCategory);
    } catch (error) {
      console.error('createCategory error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        attributes: ['id', 'name', 'parent_id'],
        include: [
          {
            model: Category,
            as: 'Parent',
            attributes: ['id', 'name'],
            required: false, // Allow categories without a parent
          },
        ],
      });
      return res.status(200).json(categories);
    } catch (error) {
      console.error('getAllCategories error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) return res.status(400).json({ message: 'ID danh mục không hợp lệ' });
      const category = await Category.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'Parent',
            attributes: ['id', 'name'],
            required: false,
          },
        ],
      });
      if (!category) return res.status(404).json({ message: 'Danh mục không tồn tại' });
      return res.status(200).json(category);
    } catch (error) {
      console.error('getCategoryById error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, parent_id } = req.body;
      if (isNaN(id)) return res.status(400).json({ message: 'ID danh mục không hợp lệ' });

      if (name && name.length === 0) {
        return res.status(400).json({ message: 'Tên danh mục không được để trống' });
      }
      if (parent_id) {
        const parent = await Category.findByPk(parent_id);
        if (!parent) return res.status(400).json({ message: 'Danh mục cha không tồn tại' });
        if (parent_id === parseInt(id)) {
          return res.status(400).json({ message: 'Danh mục không thể là cha của chính nó' });
        }
      }

      const [updated] = await Category.update({ name, parent_id }, { where: { id } });
      if (!updated) return res.status(404).json({ message: 'Danh mục không tồn tại' });

      const updatedCategory = await Category.findByPk(id);
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error('updateCategory error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) return res.status(400).json({ message: 'ID danh mục không hợp lệ' });
      const products = await Product.count({ where: { category_id: id } });
      if (products > 0) {
        return res.status(400).json({ message: 'Không thể xóa danh mục đang chứa sản phẩm' });
      }
      const deleted = await Category.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ message: 'Danh mục không tồn tại' });
      return res.status(200).json({ message: 'Đã xóa danh mục' });
    } catch (error) {
      console.error('deleteCategory error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};