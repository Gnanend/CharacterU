require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const geminiService = require('./services/geminiService');

const PORT = parseInt(process.env.PORT || 5000, 10);

const startServer = async () => {
  try {
    // 1. Connect MongoDB
    await connectDB();

    // 2. Initialize Gemini
    console.log(`GEMINI_API_KEY Loaded: ${!!process.env.GEMINI_API_KEY}`);
    const isGeminiReady = await geminiService.initClient();
    
    if (isGeminiReady) {
      console.log('✓ Gemini Client Initialized');
    } else {
      console.log('✗ Gemini Initialization Failed (Running in Fallback Mode)');
    }

    // 3. Start Express Server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${PORT} is in use. Trying port ${PORT + 1}...`);
        app.listen(PORT + 1, () => {
          console.log(`Server running on fallback port ${PORT + 1}`);
        });
      } else {
        console.error('Server error:', err);
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
