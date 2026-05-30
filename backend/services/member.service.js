const { pool } = require('../config/db');

const findByEmail = async (email) => {
  const result = await pool.query('SELECT id FROM members WHERE email = $1', [email]);
  return result.rows;
};

const findByUsername = async (username) => {
  const result = await pool.query('SELECT id FROM members WHERE username = $1', [username]);
  return result.rows;
};

const findByUsernameOrEmail = async (identifier) => {
  const result = await pool.query('SELECT * FROM members WHERE username = $1 OR email = $1', [identifier]);
  return result.rows;
};

const createMember = async (username, email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO members (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

module.exports = {
  findByEmail,
  findByUsername,
  findByUsernameOrEmail,
  createMember
};
