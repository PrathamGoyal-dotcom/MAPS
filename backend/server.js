const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

// 4. Payment Record & Email Notification
app.post('/api/payment', async (req, res) => {
  const { user, className, amount, status } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'sarvagya665@gmail.com';

  console.log(`--- BOOKING RECORD: ${className} ---`);
  console.log(`User: ${user.username} (${user.email})`);
  console.log(`Status: ${status}`);

  try {
    // Save to Database
    await pool.query(
      'INSERT INTO bookings (username, email, class_name, amount, status) VALUES ($1, $2, $3, $4, $5)',
      [user.username, user.email, className, amount, status]
    );
    console.log('Booking saved to database.');

    // Send Actual Email
    const mailOptions = {
      from: `"MAPS Gym" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Booking: ${className}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #FF2D2D;">New Booking Confirmed</h2>
          <p><strong>User:</strong> ${user.username}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Class/Plan:</strong> ${className}</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
          <p><strong>Status:</strong> ${status}</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888;">This is an automated notification from MAPS Gym Portal.</p>
        </div>
      `
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-app-password') {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', adminEmail);
      res.json({ message: 'Booking record saved and email sent to administrator.' });
    } else {
      console.log('Skipping real email: Credentials missing or placeholder detected.');
      res.json({ message: 'Booking saved to database (Email skipped due to missing credentials).' });
    }
  } catch (error) {
    console.error('Error in /api/payment:', error);
    res.status(500).json({ message: 'Error processing booking record' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
