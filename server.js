const app = require('./app');
require('dotenv').config();
const db = require('./models');
const { QueryTypes } = require('sequelize');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Kết nối MySQL thành công');

    // Kiểm tra chỉ mục
    const indexes = await db.sequelize.query('SHOW INDEXES FROM Users', {
      type: QueryTypes.SELECT,
    });
    console.log('Chỉ mục hiện tại:', indexes);

    // Xóa chỉ mục dư thừa nếu cần
    const emailIndexes = indexes.filter(index => index.Key_name.startsWith('email_'));
    for (const index of emailIndexes) {
      await db.sequelize.query(`DROP INDEX \`${index.Key_name}\` ON Users`);
      console.log(`Đã xóa chỉ mục: ${index.Key_name}`);
    }

    await db.sequelize.sync({ alter: true });
    console.log('✅ CSDL đã được đồng bộ');

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Lỗi kết nối CSDL:', err);
    process.exit(1);
  }
})();