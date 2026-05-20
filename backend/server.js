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

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if email already exists
    const emailCheck = await pool.query('SELECT id FROM members WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email ID already exists' });
    }

    // Check if username already exists
    const userCheck = await pool.query('SELECT id FROM members WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO members (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ user, token, message: 'Registration successful' });
  } catch (err) {
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
  const adminEmail = process.env.ADMIN_EMAIL || 'sarvagya665@gmail.com';

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });

    // Save to Database
    await pool.query(
      'INSERT INTO registrations (name, email, phone, interest, message) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone, interest, message]
    );
    console.log('Registration saved to database.');

    // 1. Email for Admin (Owner)
    const adminMailOptions = {
      from: `"MAPS Gym" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Inquiry/Free Trial: ${interest}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #f97316;">New Free Trial Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Interest:</strong> ${interest}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Time of Request:</strong> ${submissionTime}</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888;">Automated notification to owner.</p>
        </div>
      `
    };

    // 2. Email for User
    const userMailOptions = {
      from: `"MAPS Gym" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Confirmation: Your Request at MAPS Gym`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #f97316;">Hi ${name},</h2>
          <p>Thank you for reaching out to MAPS Gym! We have received your request for a <strong>${interest}</strong>.</p>
          <p>Our team will review your details and contact you shortly.</p>
          <h3>Your Submitted Details:</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Submission Time:</strong> ${submissionTime}</p>
          <br/>
          <p>Keep crushing it, <br/><strong>The MAPS Gym Team</strong></p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888;">This is an automated confirmation message. Please do not reply directly.</p>
        </div>
      `
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-app-password') {
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(userMailOptions);
      console.log('Registration emails sent successfully to owner and user.');
      res.status(201).json({ message: 'Registration received and confirmation emails sent.' });
    } else {
      console.log('Skipping real emails for registration: Credentials missing or placeholder detected.');
      console.log('Target Emails -> Owner:', adminEmail, 'User:', email);
      res.status(201).json({ message: 'Registration saved (Emails skipped due to missing credentials).' });
    }
  } catch (err) {
    console.error('Error in /api/join:', err);
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

// ===== COMMUNITY LOUNGE CHAT API =====

// 5. Get recent chat messages
app.get('/api/chat', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM (SELECT * FROM chat_messages ORDER BY id DESC LIMIT 50) sub ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching chat:', err);
    res.status(500).json({ message: 'Error retrieving chat messages' });
  }
});

// 6. Post new chat message
app.post('/api/chat', async (req, res) => {
  const { username, message, isCoach, avatarColor } = req.body;
  if (!username || !message) {
    return res.status(400).json({ message: 'Username and message are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO chat_messages (username, message, is_coach, avatar_color) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, message, isCoach || false, avatarColor || '#FF2D2D']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving chat message:', err);
    res.status(500).json({ message: 'Error saving chat message' });
  }
});

// 7. Add reaction to a message
app.post('/api/chat/react', async (req, res) => {
  const { messageId, reactionType } = req.body;
  if (!messageId || !reactionType) {
    return res.status(400).json({ message: 'Message ID and reaction type are required' });
  }

  try {
    const result = await pool.query(
      `UPDATE chat_messages 
       SET reactions = jsonb_set(reactions, ARRAY[$2], to_jsonb(COALESCE((reactions->>$2)::int, 0) + 1)) 
       WHERE id = $1 RETURNING *`,
      [messageId, reactionType]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding reaction:', err);
    res.status(500).json({ message: 'Error adding reaction' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
