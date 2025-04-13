// server.js
const app = require('./app');
require('dotenv').config();

const db = require('./models'); // Gọi models/index.js

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Kết nối MySQL thành công');

    await db.sequelize.sync({ alter: true }); // ⚠️ Tự động tạo bảng và cập nhật nếu có thay đổi
    console.log('✅ CSDL đã được đồng bộ');

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Lỗi kết nối CSDL:', err);
    process.exit(1);
  }
})();
