const { Product, Category, ProductVariant } = require('../models');
const { sequelize } = require('../models');

module.exports = {
  createProduct: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { name, description, category_id, sku, price, stock } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      // Validate required fields
      if (!name) return res.status(400).json({ message: 'Tên sản phẩm là bắt buộc' });
      if (!description) return res.status(400).json({ message: 'Mô tả sản phẩm là bắt buộc' });
      if (!category_id) return res.status(400).json({ message: 'Danh mục sản phẩm là bắt buộc' });

      // Validate optional variant fields
      if (sku || price || stock) {
        if (!sku || !price || !stock) {
          return res.status(400).json({ message: 'SKU, giá và tồn kho phải được cung cấp cùng nhau' });
        }
        if (typeof sku !== 'string' || sku.length < 3) {
          return res.status(400).json({ message: 'SKU phải có ít nhất 3 ký tự' });
        }
        if (isNaN(price) || price <= 0) {
          return res.status(400).json({ message: 'Giá phải là số lớn hơn 0' });
        }
        if (isNaN(stock) || stock < 0) {
          return res.status(400).json({ message: 'Tồn kho phải là số không âm' });
        }
      }

      // Verify category exists
      const category = await Category.findByPk(category_id, { transaction });
      if (!category) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Danh mục không tồn tại' });
      }

      // Create product
      const newProduct = await Product.create(
        { name, description, image, category_id },
        { transaction }
      );

      // Create variant if provided
      let variant = null;
      if (sku && price && stock) {
        const existingVariant = await ProductVariant.findOne({ where: { sku }, transaction });
        if (existingVariant) {
          await transaction.rollback();
          return res.status(400).json({ message: 'SKU đã tồn tại' });
        }
        variant = await ProductVariant.create(
          { product_id: newProduct.id, sku, price, stock },
          { transaction }
        );
      }

      await transaction.commit();
      return res.status(201).json({ product: newProduct, variant });
    } catch (error) {
      await transaction.rollback();
      console.error('createProduct error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const { count, rows } = await Product.findAndCountAll({
        include: [
          { model: Category, as: 'Category', attributes: ['id', 'name'] },
          { model: ProductVariant, as: 'Variants', attributes: ['id', 'sku', 'price', 'stock'] },
        ],
        limit,
        offset,
      });
      return res.status(200).json({
        totalItems: count,
        products: rows,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      console.error('getAllProducts error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
      const product = await Product.findByPk(id, {
        include: [
          { model: Category, as: 'Category', attributes: ['id', 'name'] },
          { model: ProductVariant, as: 'Variants', attributes: ['id', 'sku', 'price', 'stock'] },
        ],
      });
      if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      return res.status(200).json(product);
    } catch (error) {
      console.error('getProduct error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, category_id, image } = req.body;
      if (isNaN(id)) return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });

      if (category_id) {
        const category = await Category.findByPk(category_id);
        if (!category) return res.status(400).json({ message: 'Danh mục không tồn tại' });
      }

      const [updated] = await Product.update(
        { name, description, category_id, image },
        { where: { id } }
      );
      if (!updated) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

      const updatedProduct = await Product.findByPk(id);
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('updateProduct error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
      const deleted = await Product.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      return res.status(200).json({ message: 'Đã xóa sản phẩm' });
    } catch (error) {
      console.error('deleteProduct error:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};