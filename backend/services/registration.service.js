const { pool } = require('../config/db');

const createRegistration = async (name, email, phone, interest, message) => {
  const result = await pool.query(
    'INSERT INTO registrations (name, email, phone, interest, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, email, phone, interest, message]
  );
  return result.rows[0];
};

module.exports = {
  createRegistration
};
