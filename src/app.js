const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const routes = require('./routes/v1');

const app = express();

/**
 * Security and Utility Middlewares
 */
// Set security HTTP headers
app.use(helmet());

// Enable CORS for frontend communication
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));

// Parse incoming JSON payloads
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10000 : 100, // Substantially higher limit in development
  message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);

/**
 * API Routes - Versioning implementation
 */
app.use('/api/v1', routes);

/**
 * Error Handling Middlewares
 */
// Catch unhandled routes and forward to error handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
