require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_NAME: process.env.DB_NAME || 'maps_gym',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_PORT: process.env.DB_PORT || 5432,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'sarvagya665@gmail.com'
};
