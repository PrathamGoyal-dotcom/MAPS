const { pool } = require('../config/db');

const getRecentChats = async () => {
  const result = await pool.query(
    'SELECT * FROM (SELECT * FROM chat_messages ORDER BY id DESC LIMIT 50) sub ORDER BY id ASC'
  );
  return result.rows;
};

const createChat = async (username, message, isCoach, avatarColor) => {
  const result = await pool.query(
    'INSERT INTO chat_messages (username, message, is_coach, avatar_color) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, message, isCoach || false, avatarColor || '#FF2D2D']
  );
  return result.rows[0];
};

const addReaction = async (messageId, reactionType) => {
  const result = await pool.query(
    `UPDATE chat_messages 
     SET reactions = jsonb_set(reactions, ARRAY[$2], to_jsonb(COALESCE((reactions->>$2)::int, 0) + 1)) 
     WHERE id = $1 RETURNING *`,
    [messageId, reactionType]
  );
  return result.rows[0];
};

module.exports = {
  getRecentChats,
  createChat,
  addReaction
};
