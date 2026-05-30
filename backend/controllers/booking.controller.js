const bookingService = require('../services/booking.service');
const env = require('../config/env');
const { sendMail } = require('../utils/email');

const payment = async (req, res) => {
  const { user, className, amount, status } = req.body;

  console.log(`--- BOOKING RECORD: ${className} ---`);
  console.log(`User: ${user.username} (${user.email})`);
  console.log(`Status: ${status}`);

  try {
    await bookingService.createBooking(user.username, user.email, className, amount, status);
    console.log('Booking saved to database.');

    const mailOptions = {
      from: `"MAPS Gym" <${env.EMAIL_USER}>`,
      to: env.ADMIN_EMAIL,
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

    const isSent = await sendMail(mailOptions);

    if (isSent) {
      console.log('Email sent successfully to:', env.ADMIN_EMAIL);
      res.json({ message: 'Booking record saved and email sent to administrator.' });
    } else {
      res.json({ message: 'Booking saved to database (Email skipped due to missing credentials).' });
    }
  } catch (error) {
    console.error('Error in /api/payment:', error);
    res.status(500).json({ message: 'Error processing booking record' });
  }
};

module.exports = {
  payment
};
