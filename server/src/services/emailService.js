const nodemailer = require('nodemailer');

// Create Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'dialoabo@gmail.com',
      pass: process.env.SMTP_PASS || 'wigv smde xsba widc'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send contact form email
const sendContactEmail = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const { name, email, message } = contactData;
    
    // Email to admin
    const adminMailOptions = {
      from: `"Learn and Grow Platform" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'dialoabo@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Learn and Grow Platform</h1>
            <p style="color: white; margin: 5px 0;">New Contact Form Submission</p>
          </div>
          
          <div style="padding: 20px; background-color: #f8f9fa;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
              Contact Details
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; background-color: #e9ecef; font-weight: bold; width: 30%;">
                  Name:
                </td>
                <td style="padding: 10px; background-color: white;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #e9ecef; font-weight: bold;">
                  Email:
                </td>
                <td style="padding: 10px; background-color: white;">
                  <a href="mailto:${email}" style="color: #667eea;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #e9ecef; font-weight: bold; vertical-align: top;">
                  Message:
                </td>
                <td style="padding: 10px; background-color: white;">
                  ${message.replace(/\n/g, '<br>')}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #e9ecef; font-weight: bold;">
                  Timestamp:
                </td>
                <td style="padding: 10px; background-color: white;">
                  ${new Date().toLocaleString()}
                </td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #d1ecf1; border-left: 4px solid #bee5eb;">
              <p style="margin: 0; color: #0c5460;">
                <strong>Quick Actions:</strong>
              </p>
              <p style="margin: 5px 0 0 0;">
                Reply directly to <a href="mailto:${email}" style="color: #0c5460;">${email}</a> to respond to this inquiry.
              </p>
            </div>
          </div>
          
          <div style="background-color: #343a40; color: white; padding: 15px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              Learn and Grow Educational Platform | 
              <a href="http://localhost:3000" style="color: #ffc107;">Visit Platform</a>
            </p>
          </div>
        </div>
      `
    };

    // Confirmation email to user
    const userMailOptions = {
      from: `"Learn and Grow Platform" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank you for contacting Learn and Grow!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Learn and Grow Platform</h1>
            <p style="color: white; margin: 5px 0;">Thank You for Reaching Out!</p>
          </div>
          
          <div style="padding: 20px; background-color: #f8f9fa;">
            <h2 style="color: #333;">Hi ${name},</h2>
            
            <p style="color: #555; line-height: 1.6;">
              Thank you for contacting us! We've received your message and appreciate you taking the time to reach out to the Learn and Grow educational platform.
            </p>
            
            <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #0066cc; margin-top: 0;">Your Message Summary:</h3>
              <p style="color: #333; font-style: italic; margin: 0;">
                "${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"
              </p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              Our team will review your inquiry and get back to you within 24-48 hours. In the meantime, feel free to explore our platform and check out our educational programs.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/dashboard" 
                 style="background-color: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Visit Our Platform
              </a>
            </div>
            
            <h3 style="color: #333; margin-top: 30px;">Quick Links:</h3>
            <ul style="color: #555;">
              <li><a href="http://localhost:3000/program" style="color: #667eea;">Browse Programs</a></li>
              <li><a href="http://localhost:3000/tutors" style="color: #667eea;">Meet Our Tutors</a></li>
              <li><a href="http://localhost:3000/about" style="color: #667eea;">About Us</a></li>
            </ul>
          </div>
          
          <div style="background-color: #343a40; color: white; padding: 15px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              Best regards,<br>
              The Learn and Grow Team<br>
              <a href="mailto:dialoabo@gmail.com" style="color: #ffc107;">dialoabo@gmail.com</a>
            </p>
          </div>
        </div>
      `
    };

    // Send both emails
    const adminResult = await transporter.sendMail(adminMailOptions);
    const userResult = await transporter.sendMail(userMailOptions);

    console.log('✅ Emails sent successfully');
    console.log('Admin email ID:', adminResult.messageId);
    console.log('User confirmation email ID:', userResult.messageId);

    return {
      success: true,
      message: 'Emails sent successfully',
      adminMessageId: adminResult.messageId,
      userMessageId: userResult.messageId
    };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Test email connection
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Gmail SMTP connection failed:', error);
    return false;
  }
};

module.exports = {
  sendContactEmail,
  testEmailConnection
};
