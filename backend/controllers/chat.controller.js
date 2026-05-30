const chatService = require('../services/chat.service');

const getChats = async (req, res) => {
  try {
    const chats = await chatService.getRecentChats();
    res.json(chats);
  } catch (err) {
    console.error('Error fetching chat:', err);
    res.status(500).json({ message: 'Error retrieving chat messages' });
  }
};

const postChat = async (req, res) => {
  const { username, message, isCoach, avatarColor } = req.body;
  if (!username || !message) {
    return res.status(400).json({ message: 'Username and message are required' });
  }
  
  try {
    const newChat = await chatService.createChat(username, message, isCoach, avatarColor);
    res.status(201).json(newChat);
  } catch (err) {
    console.error('Error saving chat message:', err);
    res.status(500).json({ message: 'Error saving chat message' });
  }
};

const reactChat = async (req, res) => {
  const { messageId, reactionType } = req.body;
  if (!messageId || !reactionType) {
    return res.status(400).json({ message: 'Message ID and reaction type are required' });
  }

  try {
    const updatedChat = await chatService.addReaction(messageId, reactionType);
    if (!updatedChat) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(updatedChat);
  } catch (err) {
    console.error('Error adding reaction:', err);
    res.status(500).json({ message: 'Error adding reaction' });
  }
};

module.exports = {
  getChats,
  postChat,
  reactChat
};
