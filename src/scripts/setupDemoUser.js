const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const DailyCheckIn = require('../models/DailyCheckIn');
const Pledge = require('../models/Pledge');

dotenv.config({ path: __dirname + '/../../.env' });

const setupDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'gnani10@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }

    console.log(`Found user: ${user.fullName} (${user._id})`);

    // 1. Update Character Score & Profile Completion
    let updatedScore = Math.max(user.characterScore || 0, 85);
    user.characterScore = updatedScore;
    user.city = user.city || 'San Francisco';
    user.country = user.country || 'USA';
    user.avatar = user.avatar || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
    await user.save();
    console.log('User profile and score updated.');

    // 2. Check-ins
    const checkInCount = await DailyCheckIn.countDocuments({ user: user._id });
    const checkInsNeeded = Math.max(0, 7 - checkInCount);
    
    if (checkInsNeeded > 0) {
      const docs = [];
      for (let i = 0; i < checkInsNeeded; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i - 1);
        docs.push({
          user: user._id,
          date: d,
          mood: 'happy',
          reflection: `This is demo reflection day ${i+1}.`,
          createdAt: d,
          updatedAt: d
        });
      }
      await DailyCheckIn.insertMany(docs);
      console.log(`Inserted ${checkInsNeeded} Check-ins.`);
    } else {
      console.log('User already has 7+ Check-ins.');
    }

    // 3. Pledges
    const pledgeCount = await Pledge.countDocuments({ user: user._id, status: 'approved' });
    if (pledgeCount === 0) {
      const pledge = new Pledge({
        user: user._id,
        pledgeText: 'I pledge to always act with integrity.',
        videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1312461204/sample.mp4',
        status: 'approved',
        isVerified: true
      });
      await pledge.save();
      console.log('Inserted 1 approved Pledge.');
    } else {
      console.log('User already has an approved pledge.');
    }

    console.log('--- SETUP COMPLETE ---');
    console.log({
      characterScore: user.characterScore,
      city: user.city,
      country: user.country,
      avatar: user.avatar
    });

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

setupDemo();
