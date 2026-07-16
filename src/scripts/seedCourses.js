require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

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
      let course;
      if (existingCourse) {
        course = await Course.findOneAndUpdate({ slug: courseData.slug }, { $set: courseData }, { new: true });
        skipped++; // Treating updates as skipped for the original seed log structure
      } else {
        course = await Course.create(courseData);
        inserted++;
      }

      // Seed Modules and Lessons for this course
      const moduleData = {
        course: course._id,
        title: `Introduction to ${courseData.titleKey}`,
        description: 'Basic concepts and introduction',
        order: 1,
        isPublished: true
      };
      
      let module = await Module.findOne({ course: course._id, title: moduleData.title });
      if (!module) {
        module = await Module.create(moduleData);
      }

      let videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      if (courseData.slug === 'integrity-foundation') videoUrl = 'https://www.youtube.com/watch?v=mPJoi08HaRY';
      else if (courseData.slug === 'power-of-respect') videoUrl = 'https://www.youtube.com/watch?v=VG3arGjg0Hk';
      else if (courseData.slug === 'leadership-essentials') videoUrl = 'https://www.youtube.com/watch?v=r9u5YcEAkE0';
      else if (courseData.slug === 'taking-responsibility') videoUrl = 'https://www.youtube.com/watch?v=0xW6hCnlSjE';
      else if (courseData.slug === 'practicing-empathy') videoUrl = 'https://www.youtube.com/watch?v=jz1g1SpD9Zo'; // PASSED previously
      else if (courseData.slug === 'discipline-focus') videoUrl = 'https://www.youtube.com/watch?v=5oX7uRcnHdI';

      const lessonData = {
        module: module._id,
        title: `Lesson 1: Basics of ${courseData.titleKey}`,
        description: 'Learn the foundational elements',
        content: 'This is the content of the lesson.',
        videoUrl: videoUrl,
        estimatedMinutes: courseData.estimatedMinutes,
        xpReward: courseData.xpReward,
        order: 1,
        isPublished: true
      };

      let lesson = await Lesson.findOne({ module: module._id, title: lessonData.title });
      if (!lesson) {
        await Lesson.create(lessonData);
      } else {
        await Lesson.updateOne({ _id: lesson._id }, { $set: { videoUrl: videoUrl } });
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
