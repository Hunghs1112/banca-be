const { ProductVariant, Product } = require('../models');

module.exports = {
  createProductVariant: async (req, res) => {
    try {
      const { product_id, sku, price, stock } = req.body;
      if (!product_id || !sku || !price || !stock) {
        return res.status(400).json({ message: 'product_id, SKU, giá và tồn kho là bắt buộc' });
      }
      if (isNaN(product_id)) return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
      if (typeof sku !== 'string' || sku.length < 3) {
        return res.status(400).json({ message: 'SKU phải có ít nhất 3 ký tự' });
      }
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: 'Giá phải là số lớn hơn 0' });
      }
      if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ message: 'Tồn kho phải là số không âm' });
      }

      const product = await Product.findByPk(product_id);
      if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

      const existingVariant = await ProductVariant.findOne({ where: { sku } });
      if (existingVariant) return res.status(400).json({ message: 'SKU đã tồn tại' });

      const newVariant = await ProductVariant.create({ product_id, sku, price, stock });
      return res.status(201).json(newVariant);
    } catch (error) {
      console.error('createProductVariant error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getProductVariants: async (req, res) => {
    try {
      const { product_id } = req.params;
      if (isNaN(product_id)) return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
      const variants = await ProductVariant.findAll({
        where: { product_id },
        attributes: ['id', 'sku', 'price', 'stock'],
      });
      return res.status(200).json(variants);
    } catch (error) {
      console.error('getProductVariants error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getProductVariantById: async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) return res.status(400).json({ message: 'ID biến thể không hợp lệ' });
      const variant = await ProductVariant.findByPk(id, {
        include: [{ model: Product, as: 'Product', attributes: ['id', 'name'] }],
      });
      if (!variant) return res.status(404).json({ message: 'Biến thể không tồn tại' });
      return res.status(200).json(variant);
    } catch (error) {
      console.error('getProductVariantById error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  updateProductVariant: async (req, res) => {
    try {
      const { id } = req.params;
      const { sku, price, stock } = req.body;
      if (isNaN(id)) return res.status(400).json({ message: 'ID biến thể không hợp lệ' });

      if (sku && (typeof sku !== 'string' || sku.length < 3)) {
        return res.status(400).json({ message: 'SKU phải có ít nhất 3 ký tự' });
      }
      if (price && (isNaN(price) || price <= 0)) {
        return res.status(400).json({ message: 'Giá phải là số lớn hơn 0' });
      }
      if (stock && (isNaN(stock) || stock < 0)) {
        return res.status(400).json({ message: 'Tồn kho phải là số không âm' });
      }

      if (sku) {
        const existingVariant = await ProductVariant.findOne({
          where: { sku, id: { [require('sequelize').Op.ne]: id } },
        });
        if (existingVariant) return res.status(400).json({ message: 'SKU đã tồn tại' });
      }

      const [updated] = await ProductVariant.update(req.body, { where: { id } });
      if (!updated) return res.status(404).json({ message: 'Biến thể không tồn tại' });

      const updatedVariant = await ProductVariant.findByPk(id);
      return res.status(200).json(updatedVariant);
    } catch (error) {
      console.error('updateProductVariant error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  deleteProductVariant: async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) return res.status(400).json({ message: 'ID biến thể không hợp lệ' });
      const deleted = await ProductVariant.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ message: 'Biến thể không tồn tại' });
      return res.status(200).json({ message: 'Đã xóa biến thể' });
    } catch (error) {
      console.error('deleteProductVariant error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};