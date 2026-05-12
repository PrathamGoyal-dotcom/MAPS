const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, '../')));

// 0. Root Route for Health Check
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Routes

// 1. Member Registration
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO members (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ user, token, message: 'Registration successful' });
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Member Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM members WHERE username = $1 OR email = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      user: { id: user.id, username: user.username, email: user.email }, 
      token, 
      message: 'Login successful' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Join Now / Contact Form Submission
app.post('/api/join', async (req, res) => {
  const { name, email, phone, interest, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    await pool.query(
      'INSERT INTO registrations (name, email, phone, interest, message) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone, interest, message]
    );
    res.status(201).json({ message: 'Registration received successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Payment Record & Email Notification Simulation
app.post('/api/payment', async (req, res) => {
  const { user, className, amount, status } = req.body;
  const adminEmail = 'sarvagya665@gmail.com';

  console.log('--- PAYMENT RECORD INITIATED ---');
  console.log(`To: ${adminEmail}`);
  console.log(`Subject: New Booking Confirmed - ${className}`);
  console.log(`User: ${user.username} (${user.email})`);
  console.log(`Class: ${className}`);
  console.log(`Amount Paid: ₹${amount}`);
  console.log(`Status: ${status}`);
  console.log('-------------------------------');

  // In a real app, you would use Nodemailer here:
  /*
  const transporter = nodemailer.createTransport({...});
  await transporter.sendMail({
    from: '"MAPS Gym" <noreply@mapsgym.in>',
    to: adminEmail,
    subject: `New Booking: ${className}`,
    text: `User ${user.username} has paid ₹${amount} for ${className}.`
  });
  */

  res.json({ message: 'Payment record sent to administrator.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
