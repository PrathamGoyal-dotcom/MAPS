const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
});

const connectDB = async () => {
  // First, connect to 'postgres' database to ensure 'maps_gym' exists
  const tempPool = new Pool({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: 'postgres',
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
  });

  try {
    const res = await tempPool.query("SELECT 1 FROM pg_database WHERE datname = 'maps_gym'");
    if (res.rowCount === 0) {
      await tempPool.query("CREATE DATABASE maps_gym");
      console.log('Database maps_gym created');
    }
  } catch (err) {
    console.error('Error checking/creating database:', err);
  } finally {
    await tempPool.end();
  }

  const client = await pool.connect();
  try {
    // Create members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create registrations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        interest VARCHAR(50),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        class_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Pending',
        booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create chat_messages table with JSONB reactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        is_coach BOOLEAN DEFAULT FALSE,
        avatar_color VARCHAR(100) DEFAULT '#FF2D2D',
        reactions JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure column is large enough to hold gradient strings
    await client.query(`
      ALTER TABLE chat_messages ALTER COLUMN avatar_color TYPE VARCHAR(100);
    `);

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

module.exports = { pool, connectDB };
