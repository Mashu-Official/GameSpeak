const { Sequelize } = require('sequelize');

// 创建一个新的 Sequelize 实例并指定使用 SQLite
// 在这个例子中，数据库将会存储在一个名为 'database.sqlite' 的文件中
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../database.sqlite', // 指定 SQLite 数据库文件的位置
});

// 测试连接
(async () => {
    try {
        await sequelize.authenticate();
        console.log('数据库连接成功');
    } catch (error) {
        console.error('无法连接到数据库:', error);
    }
})();

module.exports = sequelize;