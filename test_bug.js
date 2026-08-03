
require('dotenv').config();
require('./src/config/db')().then(async () => {
  const Module = require('./src/models/Module');
  const Course = require('./src/models/Course');
  const Lesson = require('./src/models/Lesson');
  
  const course = await Course.findOne();
  if (!course) { console.log('No course'); process.exit(0); }
  let mod = await Module.findOne({ course: course._id });
  if (!mod) {
    mod = await Module.create({ course: course._id, title: 'Test Mod' });
  }
  
  const newLesson = await Lesson.create({
    module: mod._id,
    title: 'Test Lesson ' + Date.now(),
    lessonType: 'Video',
    duration: 10
  });
  console.log('Created Lesson:', newLesson._id);
  
  // Now simulate adminController.getCourseById
  const modules = await Module.find({ course: course._id }).sort({ order: 1 }).lean();
  const lessons = await Lesson.find({ module: { $in: modules.map(m => m._id) } }).sort({ order: 1 }).lean();
  
  console.log('Modules found:', modules.length);
  console.log('Lessons found for modules:', lessons.length);
  
  const targetModId = String(mod._id);
  const filtered = lessons.filter(l => String(l.module) === targetModId);
  console.log('Filtered lessons for mod:', filtered.length);
  process.exit(0);
});

