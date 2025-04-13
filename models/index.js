const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import models
const Category = require('./Category');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');
const User = require('./User');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Address = require('./Address');

// Associations
Category.hasMany(Product, { foreignKey: 'category_id', as: 'Products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' });

Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'Variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'Product' });

User.hasOne(Cart, { foreignKey: 'userId', as: 'Cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'User' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'CartItems' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'Cart' });

Product.hasMany(CartItem, { foreignKey: 'productId', as: 'CartItems' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'Product' });

ProductVariant.hasMany(CartItem, { foreignKey: 'variantId', as: 'CartItems' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'Variant' });

User.hasMany(Order, { foreignKey: 'userId', as: 'Orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'User' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'OrderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'Order' });

ProductVariant.hasMany(OrderItem, { foreignKey: 'productVariantId', as: 'OrderItems' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'productVariantId', as: 'Variant' });

Order.hasOne(Payment, { foreignKey: 'orderId', as: 'Payment' });
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'Order' });

User.hasMany(Address, { foreignKey: 'userId', as: 'UserAddresses' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// Self-referential association for Category
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'Parent' });
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'SubCategories' });

// Export models
module.exports = {
  sequelize,
  Category,
  Product,
  ProductVariant,
  User,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Address,
};