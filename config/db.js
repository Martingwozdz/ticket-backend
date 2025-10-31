// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || null,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    port: process.env.DB_PORT || 5432
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected (Local PostgreSQL)'))
  .catch(err => console.error('❌ Database connection error:', err));

// Sync models
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database synced'))
  .catch(err => console.error('❌ Database sync error:', err));

module.exports = sequelize;