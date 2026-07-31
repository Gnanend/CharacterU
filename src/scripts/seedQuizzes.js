require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

const quizData = {
  'integrity-foundation': {
    titleKey: 'integrity_quiz_title',
    questions: [
      {
        questionKey: 'integrity_q1_q',
        optionKeys: ['integrity_q1_opt1', 'integrity_q1_opt2', 'integrity_q1_opt3', 'integrity_q1_opt4'],
        correctAnswer: 1,
        explanationKey: 'integrity_q1_exp'
      },
      {
        questionKey: 'integrity_q2_q',
        optionKeys: ['integrity_q2_opt1', 'integrity_q2_opt2', 'integrity_q2_opt3', 'integrity_q2_opt4'],
        correctAnswer: 2,
        explanationKey: 'integrity_q2_exp'
      },
      {
        questionKey: 'integrity_q3_q',
        optionKeys: ['integrity_q3_opt1', 'integrity_q3_opt2', 'integrity_q3_opt3', 'integrity_q3_opt4'],
        correctAnswer: 2,
        explanationKey: 'integrity_q3_exp'
      },
      {
        questionKey: 'integrity_q4_q',
        optionKeys: ['integrity_q4_opt1', 'integrity_q4_opt2', 'integrity_q4_opt3', 'integrity_q4_opt4'],
        correctAnswer: 1,
        explanationKey: 'integrity_q4_exp'
      },
      {
        questionKey: 'integrity_q5_q',
        optionKeys: ['integrity_q5_opt1', 'integrity_q5_opt2', 'integrity_q5_opt3', 'integrity_q5_opt4'],
        correctAnswer: 3,
        explanationKey: 'integrity_q5_exp'
      },
    ]
  },
  'power-of-respect': {
    titleKey: 'respect_quiz_title',
    questions: [
      {
        questionKey: 'respect_q1_q',
        optionKeys: ['respect_q1_opt1', 'respect_q1_opt2', 'respect_q1_opt3', 'respect_q1_opt4'],
        correctAnswer: 0,
        explanationKey: 'respect_q1_exp'
      },
      {
        questionKey: 'respect_q2_q',
        optionKeys: ['respect_q2_opt1', 'respect_q2_opt2', 'respect_q2_opt3', 'respect_q2_opt4'],
        correctAnswer: 2,
        explanationKey: 'respect_q2_exp'
      },
      {
        questionKey: 'respect_q3_q',
        optionKeys: ['respect_q3_opt1', 'respect_q3_opt2', 'respect_q3_opt3', 'respect_q3_opt4'],
        correctAnswer: 1,
        explanationKey: 'respect_q3_exp'
      },
      {
        questionKey: 'respect_q4_q',
        optionKeys: ['respect_q4_opt1', 'respect_q4_opt2', 'respect_q4_opt3', 'respect_q4_opt4'],
        correctAnswer: 1,
        explanationKey: 'respect_q4_exp'
      },
      {
        questionKey: 'respect_q5_q',
        optionKeys: ['respect_q5_opt1', 'respect_q5_opt2', 'respect_q5_opt3', 'respect_q5_opt4'],
        correctAnswer: 2,
        explanationKey: 'respect_q5_exp'
      },
    ]
  },
  'leadership-essentials': {
    titleKey: 'leadership_quiz_title',
    questions: [
      {
        questionKey: 'leadership_q1_q',
        optionKeys: ['leadership_q1_opt1', 'leadership_q1_opt2', 'leadership_q1_opt3', 'leadership_q1_opt4'],
        correctAnswer: 1,
        explanationKey: 'leadership_q1_exp'
      },
      {
        questionKey: 'leadership_q2_q',
        optionKeys: ['leadership_q2_opt1', 'leadership_q2_opt2', 'leadership_q2_opt3', 'leadership_q2_opt4'],
        correctAnswer: 2,
        explanationKey: 'leadership_q2_exp'
      },
      {
        questionKey: 'leadership_q3_q',
        optionKeys: ['leadership_q3_opt1', 'leadership_q3_opt2', 'leadership_q3_opt3', 'leadership_q3_opt4'],
        correctAnswer: 1,
        explanationKey: 'leadership_q3_exp'
      },
      {
        questionKey: 'leadership_q4_q',
        optionKeys: ['leadership_q4_opt1', 'leadership_q4_opt2', 'leadership_q4_opt3', 'leadership_q4_opt4'],
        correctAnswer: 1,
        explanationKey: 'leadership_q4_exp'
      },
      {
        questionKey: 'leadership_q5_q',
        optionKeys: ['leadership_q5_opt1', 'leadership_q5_opt2', 'leadership_q5_opt3', 'leadership_q5_opt4'],
        correctAnswer: 2,
        explanationKey: 'leadership_q5_exp'
      },
    ]
  },
  'taking-responsibility': {
    titleKey: 'responsibility_quiz_title',
    questions: [
      {
        questionKey: 'responsibility_q1_q',
        optionKeys: ['responsibility_q1_opt1', 'responsibility_q1_opt2', 'responsibility_q1_opt3', 'responsibility_q1_opt4'],
        correctAnswer: 1,
        explanationKey: 'responsibility_q1_exp'
      },
      {
        questionKey: 'responsibility_q2_q',
        optionKeys: ['responsibility_q2_opt1', 'responsibility_q2_opt2', 'responsibility_q2_opt3', 'responsibility_q2_opt4'],
        correctAnswer: 2,
        explanationKey: 'responsibility_q2_exp'
      },
      {
        questionKey: 'responsibility_q3_q',
        optionKeys: ['responsibility_q3_opt1', 'responsibility_q3_opt2', 'responsibility_q3_opt3', 'responsibility_q3_opt4'],
        correctAnswer: 2,
        explanationKey: 'responsibility_q3_exp'
      },
      {
        questionKey: 'responsibility_q4_q',
        optionKeys: ['responsibility_q4_opt1', 'responsibility_q4_opt2', 'responsibility_q4_opt3', 'responsibility_q4_opt4'],
        correctAnswer: 1,
        explanationKey: 'responsibility_q4_exp'
      },
      {
        questionKey: 'responsibility_q5_q',
        optionKeys: ['responsibility_q5_opt1', 'responsibility_q5_opt2', 'responsibility_q5_opt3', 'responsibility_q5_opt4'],
        correctAnswer: 0,
        explanationKey: 'responsibility_q5_exp'
      },
    ]
  },
  'practicing-empathy': {
    titleKey: 'empathy_quiz_title',
    questions: [
      {
        questionKey: 'empathy_q1_q',
        optionKeys: ['empathy_q1_opt1', 'empathy_q1_opt2', 'empathy_q1_opt3', 'empathy_q1_opt4'],
        correctAnswer: 0,
        explanationKey: 'empathy_q1_exp'
      },
      {
        questionKey: 'empathy_q2_q',
        optionKeys: ['empathy_q2_opt1', 'empathy_q2_opt2', 'empathy_q2_opt3', 'empathy_q2_opt4'],
        correctAnswer: 1,
        explanationKey: 'empathy_q2_exp'
      },
      {
        questionKey: 'empathy_q3_q',
        optionKeys: ['empathy_q3_opt1', 'empathy_q3_opt2', 'empathy_q3_opt3', 'empathy_q3_opt4'],
        correctAnswer: 2,
        explanationKey: 'empathy_q3_exp'
      },
      {
        questionKey: 'empathy_q4_q',
        optionKeys: ['empathy_q4_opt1', 'empathy_q4_opt2', 'empathy_q4_opt3', 'empathy_q4_opt4'],
        correctAnswer: 1,
        explanationKey: 'empathy_q4_exp'
      },
      {
        questionKey: 'empathy_q5_q',
        optionKeys: ['empathy_q5_opt1', 'empathy_q5_opt2', 'empathy_q5_opt3', 'empathy_q5_opt4'],
        correctAnswer: 1,
        explanationKey: 'empathy_q5_exp'
      },
    ]
  },
  'discipline-focus': {
    titleKey: 'discipline_quiz_title',
    questions: [
      {
        questionKey: 'discipline_q1_q',
        optionKeys: ['discipline_q1_opt1', 'discipline_q1_opt2', 'discipline_q1_opt3', 'discipline_q1_opt4'],
        correctAnswer: 0,
        explanationKey: 'discipline_q1_exp'
      },
      {
        questionKey: 'discipline_q2_q',
        optionKeys: ['discipline_q2_opt1', 'discipline_q2_opt2', 'discipline_q2_opt3', 'discipline_q2_opt4'],
        correctAnswer: 1,
        explanationKey: 'discipline_q2_exp'
      },
      {
        questionKey: 'discipline_q3_q',
        optionKeys: ['discipline_q3_opt1', 'discipline_q3_opt2', 'discipline_q3_opt3', 'discipline_q3_opt4'],
        correctAnswer: 1,
        explanationKey: 'discipline_q3_exp'
      },
      {
        questionKey: 'discipline_q4_q',
        optionKeys: ['discipline_q4_opt1', 'discipline_q4_opt2', 'discipline_q4_opt3', 'discipline_q4_opt4'],
        correctAnswer: 2,
        explanationKey: 'discipline_q4_exp'
      },
      {
        questionKey: 'discipline_q5_q',
        optionKeys: ['discipline_q5_opt1', 'discipline_q5_opt2', 'discipline_q5_opt3', 'discipline_q5_opt4'],
        correctAnswer: 2,
        explanationKey: 'discipline_q5_exp'
      },
    ]
  },
};

const seedQuizzes = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected: " + mongoose.connection.host);

    let quizzesUpdated = 0;
    let questionsUpdated = 0;

    const courses = await Course.find();
    for (const course of courses) {
      if (!quizData[course.slug]) continue;

      const modules = await Module.find({ course: course._id });
      for (const module of modules) {
        const lessons = await Lesson.find({ module: module._id });
        for (const lesson of lessons) {
          
          let quiz = await Quiz.findOneAndUpdate(
            { lesson: lesson._id },
            {
              lesson: lesson._id,
              titleKey: quizData[course.slug].titleKey,
              passingScore: 80,
              isPublished: true
            },
            { upsert: true, new: true }
          );
          quizzesUpdated++;

          const templateQuestions = quizData[course.slug].questions;
          for (const tq of templateQuestions) {
            await Question.findOneAndUpdate(
              { quiz: quiz._id, questionKey: tq.questionKey },
              {
                quiz: quiz._id,
                ...tq,
                points: 20
              },
              { upsert: true, new: true }
            );
            questionsUpdated++;
          }
        }
      }
    }

    console.log('--- SEED REPORT ---');
    console.log("Quizzes Updated: " + quizzesUpdated);
    console.log("Questions Updated: " + questionsUpdated);
    process.exit(0);
  } catch (error) {
    console.error("Error: " + error.message);
    process.exit(1);
  }
};

seedQuizzes();
