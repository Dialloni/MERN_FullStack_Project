const { sendContactEmail } = require('../services/emailService');

// Handle contact form submission
exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, message) are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Send email
    const emailResult = await sendContactEmail({ name, email, message });

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: {
        timestamp: new Date().toISOString(),
        messageId: emailResult.adminMessageId
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Test email configuration
exports.testEmail = async (req, res) => {
  try {
    const testResult = await sendContactEmail({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test email from the Learn and Grow platform.'
    });

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      data: testResult
    });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Test email failed',
      error: error.message
    });
  }
};
