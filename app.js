const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
// Use CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Import route files
const cartRoutes = require('./routes/cartRoutes');
const cartItemRoutes = require('./routes/cartItemRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const productVariantRoutes = require('./routes/productVariantRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');

// Register routes
app.use('/api/carts', cartRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api', productVariantRoutes); // Mount at /api to support /api/products/:product_id/variants
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);

// Serve static files for uploads
// Phục vụ tệp tĩnh từ thư mục /Uploads
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Lỗi server', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy endpoint' });
});

module.exports = app;