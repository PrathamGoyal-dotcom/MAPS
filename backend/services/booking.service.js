const { pool } = require('../config/db');

const createBooking = async (username, email, className, amount, status) => {
  const result = await pool.query(
    'INSERT INTO bookings (username, email, class_name, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [username, email, className, amount, status]
  );
  return result.rows[0];
};

module.exports = {
  createBooking
};
