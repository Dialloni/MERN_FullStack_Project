const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Add dotenv for environment variables
const userRoutes = require('./router/userRouter');
const programRoutes = require('./router/programRouter');
const contactRoutes = require('./router/contactRouter');
const { testEmailConnection } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 8000;

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' })); // Add size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const mongoUri = process.env.MONGODB_URI || "mongodb+srv://dialoabo:UUj7OCurkuEsquEF@cluster0.j1dzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB with improved error handling
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas successfully");
})
.catch((error) => {
  console.error("❌ Error connecting to MongoDB Atlas:", error);
  process.exit(1); // Exit process if database connection fails
});

// Handle MongoDB connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

app.use('/api', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api', contactRoutes);

// Test email connection on startup
testEmailConnection();

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📧 Email service configured for: ${process.env.SMTP_USER || 'dialoabo@gmail.com'}`);
});