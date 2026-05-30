const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
});

const sendMail = async (options) => {
  if (env.EMAIL_USER && env.EMAIL_PASS && env.EMAIL_PASS !== 'your-app-password') {
    await transporter.sendMail(options);
    return true;
  } else {
    console.log('Skipping real emails: Credentials missing or placeholder detected.');
    return false;
  }
};

module.exports = {
  sendMail
};
