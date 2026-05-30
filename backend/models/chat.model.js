const ChatModel = {
  tableName: 'chat_messages',
  schema: `
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_coach BOOLEAN DEFAULT FALSE,
    avatar_color VARCHAR(100) DEFAULT '#FF2D2D',
    reactions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `
};

module.exports = ChatModel;
