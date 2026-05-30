const registrationService = require('../services/registration.service');
const env = require('../config/env');
const { sendMail } = require('../utils/email');

const join = async (req, res) => {
  const { name, email, phone, interest, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });

    await registrationService.createRegistration(name, email, phone, interest, message);
    console.log('Registration saved to database.');

    const adminMailOptions = {
      from: `"MAPS Gym" <${env.EMAIL_USER}>`,
      to: env.ADMIN_EMAIL,
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

    const userMailOptions = {
      from: `"MAPS Gym" <${env.EMAIL_USER}>`,
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

    const adminSent = await sendMail(adminMailOptions);
    const userSent = await sendMail(userMailOptions);

    if (adminSent && userSent) {
      console.log('Registration emails sent successfully to owner and user.');
      res.status(201).json({ message: 'Registration received and confirmation emails sent.' });
    } else {
      console.log('Target Emails -> Owner:', env.ADMIN_EMAIL, 'User:', email);
      res.status(201).json({ message: 'Registration saved (Emails skipped due to missing credentials).' });
    }
  } catch (err) {
    console.error('Error in /api/join:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  join
};
