const express = require('express');
const { sendContactMessage, testEmail } = require('../controllers/contactController');
const { validateContact } = require('../middleware/validation');
const { generalLimiter } = require('../middleware/security');

const router = express.Router();

// Contact form submission
router.post('/contact', generalLimiter, validateContact, sendContactMessage);

// Test email route (for development)
if (process.env.NODE_ENV === 'development') {
  router.post('/test-email', testEmail);
}

module.exports = router;
