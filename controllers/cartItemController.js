const { CartItem, Cart, Product, ProductVariant } = require('../models');

module.exports = {
  // Create or update a cart item
  createCartItem: async (req, res) => {
    const { cartId, productId, variantId, quantity } = req.body;
    if (!cartId || !productId || !variantId || !quantity) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    try {
      const cart = await Cart.findByPk(cartId);
      if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

      const [product, variant] = await Promise.all([
        Product.findByPk(productId),
        ProductVariant.findByPk(variantId),
      ]);
      if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      if (!variant) return res.status(404).json({ message: 'Biến thể không tồn tại' });
      if (variant.stock < quantity) return res.status(400).json({ message: 'Hết hàng' });

      const existingItem = await CartItem.findOne({
        where: { cartId, productId, variantId },
      });

      if (existingItem) {
        const updatedItem = await existingItem.update({
          quantity: existingItem.quantity + quantity,
        });
        return res.status(200).json(updatedItem);
      }

      const newItem = await CartItem.create({
        cartId,
        productId,
        variantId,
        sku: variant.sku,
        quantity,
        price: variant.price,
      });
      return res.status(201).json(newItem);
    } catch (error) {
      console.error('createCartItem error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Add item to cart (simplified for frontend, auto-creates cart)
  addCartItem: async (req, res) => {
    const { userId, productId, variantId, quantity } = req.body;
    if (!userId || !productId || !variantId || !quantity) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    try {
      let cart = await Cart.findOne({ where: { userId, status: 'active' } });
      if (!cart) {
        cart = await Cart.create({ userId, status: 'active' });
      }

      const [product, variant] = await Promise.all([
        Product.findByPk(productId),
        ProductVariant.findByPk(variantId),
      ]);
      if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      if (!variant) return res.status(404).json({ message: 'Biến thể không tồn tại' });
      if (variant.stock < quantity) return res.status(400).json({ message: 'Hết hàng' });

      const existingItem = await CartItem.findOne({
        where: { cartId: cart.id, productId, variantId },
      });

      if (existingItem) {
        const updatedItem = await existingItem.update({
          quantity: existingItem.quantity + quantity,
        });
        return res.status(200).json(updatedItem);
      }

      const newItem = await CartItem.create({
        cartId: cart.id,
        productId,
        variantId,
        sku: variant.sku,
        quantity,
        price: variant.price,
      });
      return res.status(201).json(newItem);
    } catch (error) {
      console.error('addCartItem error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Get cart items by cartId
  getCartItemsByCartId: async (req, res) => {
    const { cartId } = req.query;
    if (!cartId) return res.status(400).json({ message: 'Thiếu cartId' });

    try {
      const cartItems = await CartItem.findAll({
        where: { cartId },
        include: [
          { model: Product, as: 'Product', attributes: ['name', 'image'] },
          { model: ProductVariant, as: 'Variant', attributes: ['sku', 'price', 'stock'] },
        ],
      });
      return res.status(200).json(cartItems);
    } catch (error) {
      console.error('getCartItemsByCartId error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Get cart items by userId (for frontend)
  getCartItemsByUserId: async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'Thiếu userId' });

    try {
      const cart = await Cart.findOne({ where: { userId, status: 'active' } });
      if (!cart) return res.status(200).json([]);

      const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [
          { model: Product, as: 'Product', attributes: ['name', 'image'] },
          { model: ProductVariant, as: 'Variant', attributes: ['sku', 'price', 'stock'] },
        ],
      });
      return res.status(200).json(cartItems);
    } catch (error) {
      console.error('getCartItemsByUserId error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Update cart item (quantity)
  updateCartItem: async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'Số lượng không hợp lệ' });
    }

    try {
      if (quantity === 0) {
        const deleted = await CartItem.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        return res.status(200).json({ message: 'Đã xóa sản phẩm' });
      }

      const [updated] = await CartItem.update({ quantity }, { where: { id } });
      if (!updated) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

      const updatedItem = await CartItem.findByPk(id, {
        include: [
          { model: Product, as: 'Product', attributes: ['name', 'image'] },
          { model: ProductVariant, as: 'Variant', attributes: ['sku', 'price', 'stock'] },
        ],
      });
      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error('updateCartItem error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Delete cart item
  deleteCartItem: async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await CartItem.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

      return res.status(200).json({ message: 'Đã xóa sản phẩm' });
    } catch (error) {
      console.error('deleteCartItem error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Get all cart items (admin use)
  getAllCartItems: async (req, res) => {
    try {
      const cartItems = await CartItem.findAll({
        include: [
          { model: Product, as: 'Product', attributes: ['name', 'image'] },
          { model: ProductVariant, as: 'Variant', attributes: ['sku', 'price', 'stock'] },
        ],
      });
      return res.status(200).json(cartItems);
    } catch (error) {
      console.error('getAllCartItems error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },
};