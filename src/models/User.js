const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Excludes password from default mongoose select queries for security
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'admin', 'employer', 'family', 'moderator'],
        message: '{VALUE} is not a valid role',
      },
      default: 'student',
    },
    language: {
      type: String,
      default: 'en',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    characterScore: {
      type: Number,
      default: 0,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    country: {
      type: String,
      default: '',
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  }
);

/**
 * Pre-save middleware that automatically hashes the password using bcryptjs
 * before writing it to MongoDB, if the password field is modified or new.
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified or is new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare a plain text candidate password against the saved hashed password.
 * @param {string} candidatePassword - The plain text password to check.
 * @returns {Promise<boolean>} Resolves to true if passwords match, or false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Since 'password' has select: false, this.password will only be present if explicitly selected.
  // We handle comparisons by checking if this.password is loaded.
  if (!this.password) {
    throw new Error('Password hash not loaded on the User model. Make sure to select("password") in your query.');
  }
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
