// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error('❌ Lỗi:', err);
  
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Lỗi server!',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  };
  
  module.exports = errorHandler;
  