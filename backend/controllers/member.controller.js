const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const memberService = require('../services/member.service');
const env = require('../config/env');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const emailCheck = await memberService.findByEmail(email);
    if (emailCheck.length > 0) {
      return res.status(400).json({ message: 'Email ID already exists' });
    }

    const userCheck = await memberService.findByUsername(username);
    if (userCheck.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await memberService.createMember(username, email, hashedPassword);
    
    const token = jwt.sign({ id: user.id, username: user.username }, env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ user, token, message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const userCheck = await memberService.findByUsernameOrEmail(username);
    
    if (userCheck.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userCheck[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      user: { id: user.id, username: user.username, email: user.email }, 
      token, 
      message: 'Login successful' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login
};
