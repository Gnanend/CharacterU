require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Course = require('../models/Course');

const coursesToSeed = [
  {
    titleKey: 'integrityTitle',
    slug: 'integrity-foundation',
    descriptionKey: 'integrityDescription',
    thumbnail: '/course-images/integrity.jpg',
    difficulty: 'Beginner',
    estimatedMinutes: 45,
    xpReward: 100,
    order: 1,
    isPublished: true,
  },
  {
    titleKey: 'respectTitle',
    slug: 'power-of-respect',
    descriptionKey: 'respectDescription',
    thumbnail: '/course-images/respect.jpg',
    difficulty: 'Beginner',
    estimatedMinutes: 60,
    xpReward: 120,
    order: 2,
    isPublished: true,
  },
  {
    titleKey: 'leadershipTitle',
    slug: 'leadership-essentials',
    descriptionKey: 'leadershipDescription',
    thumbnail: '/course-images/leadership.jpg',
    difficulty: 'Intermediate',
    estimatedMinutes: 90,
    xpReward: 200,
    order: 3,
    isPublished: true,
  },
  {
    titleKey: 'responsibilityTitle',
    slug: 'taking-responsibility',
    descriptionKey: 'responsibilityDescription',
    thumbnail: '/course-images/responsibility.jpg',
    difficulty: 'Intermediate',
    estimatedMinutes: 75,
    xpReward: 150,
    order: 4,
    isPublished: true,
  },
  {
    titleKey: 'empathyTitle',
    slug: 'practicing-empathy',
    descriptionKey: 'empathyDescription',
    thumbnail: '/course-images/empathy.jpg',
    difficulty: 'Beginner',
    estimatedMinutes: 50,
    xpReward: 110,
    order: 5,
    isPublished: true,
  },
  {
    titleKey: 'disciplineTitle',
    slug: 'discipline-focus',
    descriptionKey: 'disciplineDescription',
    thumbnail: '/course-images/discipline.jpg',
    difficulty: 'Advanced',
    estimatedMinutes: 120,
    xpReward: 250,
    order: 6,
    isPublished: true,
  }
];

const seedCourses = async () => {
  try {
    await connectDB();
    
    let inserted = 0;
    let skipped = 0; // Keeping variable names to avoid breaking logging

    for (const courseData of coursesToSeed) {
      const existingCourse = await Course.findOne({ slug: courseData.slug });
      
      if (existingCourse) {
        await Course.updateOne({ slug: courseData.slug }, { $set: courseData });
        skipped++; // Treating updates as skipped for the original seed log structure
      } else {
        await Course.create(courseData);
        inserted++;
      }
    }

    console.log('\n--- SEED REPORT ---');
    console.log(`Courses Inserted: ${inserted}`);
    console.log(`Courses Skipped: ${skipped}`);
    
    // Verification query
    const totalCourses = await Course.countDocuments();
    console.log(`Total Courses in DB: ${totalCourses}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
