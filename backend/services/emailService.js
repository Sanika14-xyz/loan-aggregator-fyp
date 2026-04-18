const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Credify System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent to ${email}`);
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    // We don't throw the error so the app doesn't crash if an email fails to send
  }
};

module.exports = sendEmail;