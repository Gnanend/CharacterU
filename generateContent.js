const fs = require('fs');
const path = require('path');

const content = {
  'integrity-foundation': [
    {
      q: "What is the truest definition of integrity?",
      opts: ["Never making a mistake.", "Doing the right thing even when no one is watching.", "Always agreeing with your friends.", "Only following rules when a teacher is present."],
      ans: 1,
      exp: "Integrity means your actions align with your values at all times, not just when you are being observed."
    },
    {
      q: "You find a wallet on the ground with money inside. What is the action that demonstrates integrity?",
      opts: ["Keep the money and leave the wallet.", "Leave it there because it's not your problem.", "Turn it into the nearest authority or try to find the owner.", "Take a little bit of money and turn in the rest."],
      ans: 2,
      exp: "Returning the wallet shows honesty and respect for others' property, which are core components of integrity."
    },
    {
      q: "During an exam, you notice the answers are visible on the teacher's desk. What should you do?",
      opts: ["Look at them to ensure you get a good grade.", "Tell your friends so they can look too.", "Focus on your own paper and ignore the desk.", "Look but only for the questions you don't know."],
      ans: 2,
      exp: "Cheating compromises your personal integrity. Doing your own work proves your true understanding."
    },
    {
      q: "Why is keeping a promise related to integrity?",
      opts: ["Because it makes people like you.", "Because integrity involves being reliable and true to your word.", "Because you might get in trouble if you don't.", "It is not related to integrity."],
      ans: 1,
      exp: "When you keep a promise, you show that your words have value and that others can trust you."
    },
    {
      q: "You accidentally broke a tool at work, but nobody saw. What is the best response?",
      opts: ["Blame it on the previous shift.", "Quietly put it back and pretend it was already broken.", "Throw it away so nobody finds out.", "Report the accident to your supervisor immediately."],
      ans: 3,
      exp: "Admitting a mistake takes courage, but it demonstrates strong integrity and builds long-term trust."
    }
  ],
  'power-of-respect': [
    {
      q: "What does it mean to show respect to someone?",
      opts: ["Valuing their feelings, rights, and traditions.", "Agreeing with everything they say.", "Doing their chores for them.", "Never talking to them."],
      ans: 0,
      exp: "Respect is about acknowledging someone's inherent value and treating them with dignity."
    },
    {
      q: "You completely disagree with your peer's idea for a project. How should you respond?",
      opts: ["Tell them their idea is terrible.", "Interrupt them to share your better idea.", "Listen fully, then calmly explain your different perspective.", "Ignore them and do the project your own way."],
      ans: 2,
      exp: "Active listening and calm dialogue show respect for their thoughts, even when you disagree."
    },
    {
      q: "You need to borrow a pencil, and your friend's pencil case is on the desk. What is the respectful action?",
      opts: ["Take it quickly, you'll give it back later.", "Ask for permission before taking anything from their case.", "Take it but leave a note.", "Wait until they are looking and then grab it."],
      ans: 1,
      exp: "Respecting personal property means never taking things without explicit permission."
    },
    {
      q: "How does your tone of voice affect respect?",
      opts: ["It doesn't matter as long as the words are polite.", "A sarcastic or yelling tone can make polite words feel highly disrespectful.", "Only the volume matters, not the tone.", "Tone of voice is only important for adults."],
      ans: 1,
      exp: "Communication is mostly non-verbal. A harsh tone can convey disrespect regardless of the actual words used."
    },
    {
      q: "When someone is speaking to you, what is a practical way to show respect?",
      opts: ["Looking at your phone.", "Interrupting to show you understand.", "Making eye contact and nodding to show you are listening.", "Looking around the room."],
      ans: 2,
      exp: "Active listening behaviors like eye contact validate the speaker and demonstrate that you value their time."
    }
  ],
  'leadership-essentials': [
    {
      q: "What is the primary difference between a true leader and a boss?",
      opts: ["A boss inspires the team, a leader commands.", "A leader works with the team to achieve goals, a boss just gives orders.", "A leader gets paid more.", "There is no difference."],
      ans: 1,
      exp: "True leadership is about guiding and supporting a team, not just exercising authority."
    },
    {
      q: "If a team project fails, how does a good leader react?",
      opts: ["Blames the team members who made mistakes.", "Quits the team.", "Takes responsibility for the failure and helps the team learn from it.", "Pretends the project was a success."],
      ans: 2,
      exp: "Taking accountability is a hallmark of leadership. Leaders absorb the blame and share the credit."
    },
    {
      q: "Nobody wants to do the difficult part of a group assignment. What should the leader do?",
      opts: ["Force the newest member to do it.", "Take the initiative to do it themselves or work on it together with the team.", "Skip that part of the assignment.", "Complain to the teacher."],
      ans: 1,
      exp: "Leading by example means being willing to tackle the hardest tasks yourself to inspire others."
    },
    {
      q: "Why is 'leading by example' effective?",
      opts: ["It proves you are smarter than everyone else.", "People are more likely to follow what you do rather than what you say.", "It allows you to do less work later.", "It makes people fear you."],
      ans: 1,
      exp: "Actions speak louder than words. A leader who models good behavior creates a culture of excellence."
    },
    {
      q: "How does empathy play a role in leadership?",
      opts: ["It makes the leader look weak.", "It helps the leader manipulate the team.", "It allows the leader to understand team members' strengths, struggles, and motivations.", "Empathy has no role in leadership."],
      ans: 2,
      exp: "Understanding your team's feelings allows you to support them effectively and build strong morale."
    }
  ],
  'taking-responsibility': [
    {
      q: "What does it mean to take responsibility?",
      opts: ["Always doing exactly what you are told.", "Owning your choices, actions, and their consequences.", "Making sure others do their jobs.", "Never asking for help."],
      ans: 1,
      exp: "Responsibility is the acceptance of accountability for your own behavior and the results it produces."
    },
    {
      q: "You accidentally break a vase at home. What is the responsible action?",
      opts: ["Hide the pieces and pretend it never happened.", "Blame it on the family pet.", "Admit to breaking it and help clean it up.", "Run away to your room."],
      ans: 2,
      exp: "Owning up to an accident and attempting to fix it is the definition of personal accountability."
    },
    {
      q: "You missed a deadline for a project because you played video games instead. What should you say?",
      opts: ["'The project was too hard anyway.'", "'My computer broke.'", "'I didn't manage my time well, and I take full responsibility.'", "'The teacher didn't give us enough time.'"],
      ans: 2,
      exp: "Making excuses prevents personal growth. Admitting poor time management allows you to improve next time."
    },
    {
      q: "Why is blaming others harmful?",
      opts: ["It solves the problem too quickly.", "It prevents you from learning from your own mistakes and damages trust.", "It makes you look too smart.", "It isn't harmful, it's a good strategy."],
      ans: 1,
      exp: "When you blame others, you surrender your power to change and you lose the respect of your peers."
    },
    {
      q: "How do you rebuild trust after making a irresponsible mistake?",
      opts: ["Apologize sincerely, fix the mistake if possible, and don't do it again.", "Buy a gift for the person.", "Ignore the person until they forget.", "Keep apologizing constantly without changing your actions."],
      ans: 0,
      exp: "Changed behavior is the best apology. Fixing the root cause shows you have taken responsibility."
    }
  ],
  'practicing-empathy': [
    {
      q: "What is the difference between empathy and sympathy?",
      opts: ["Sympathy is feeling sorry for someone; empathy is trying to understand and share their feelings.", "They are exactly the same thing.", "Empathy is only for friends, sympathy is for strangers.", "Empathy means you agree with them, sympathy means you don't."],
      ans: 0,
      exp: "Empathy requires you to put yourself in someone else's shoes, whereas sympathy is viewing their situation from the outside."
    },
    {
      q: "A friend is crying because they failed a test. An empathetic response is:",
      opts: ["'At least you didn't fail the class!'", "'I know how much you studied for this. I am so sorry, that must feel awful.'", "'You should have studied harder.'", "'Let's go get ice cream and forget about it!'"],
      ans: 1,
      exp: "Validating their feelings without trying to immediately 'fix' it or minimize it is true empathy."
    },
    {
      q: "A new student joins your class and sits alone. How can you practice empathy?",
      opts: ["Stare at them from across the room.", "Assume they want to be left alone.", "Remember how scary it feels to be new, and go introduce yourself.", "Wait for the teacher to introduce them."],
      ans: 2,
      exp: "Using your own past experiences of feeling alienated can motivate you to make others feel welcome."
    },
    {
      q: "Why is active listening crucial for empathy?",
      opts: ["It gives you time to think of your reply.", "It shows the person you are fully present and value their experience.", "It helps you win arguments.", "It is a rule in school."],
      ans: 1,
      exp: "You cannot truly understand someone's perspective if you are not fully listening to what they are saying."
    },
    {
      q: "Can you have empathy for someone you disagree with?",
      opts: ["No, empathy means agreeing with them.", "Yes, you can understand why they feel a certain way without agreeing with their conclusion.", "Only if they apologize first.", "Yes, but only if they are family."],
      ans: 1,
      exp: "Empathy is about understanding perspective. You can understand a person's emotions while still disagreeing with their actions."
    }
  ],
  'discipline-focus': [
    {
      q: "How does discipline differ from motivation?",
      opts: ["Motivation is doing it when you feel like it; discipline is doing it even when you don't.", "Motivation is stronger than discipline.", "They are the same thing.", "Discipline is physical, motivation is mental."],
      ans: 0,
      exp: "Motivation is an emotion that fades, whereas discipline is a habit that carries you through difficult times."
    },
    {
      q: "You have homework due tomorrow, but your friends are playing your favorite game online. What does discipline look like?",
      opts: ["Playing for 'just 10 minutes'.", "Completing the homework first, then playing the game as a reward.", "Doing the homework while playing the game.", "Going to sleep to avoid deciding."],
      ans: 1,
      exp: "Discipline involves delayed gratification: doing what you must do now so you can enjoy what you want to do later."
    },
    {
      q: "Why is a daily routine important for building discipline?",
      opts: ["It makes life boring.", "It removes the need to constantly make decisions, turning good choices into habits.", "It helps you memorize the time.", "It is only important for athletes."],
      ans: 1,
      exp: "Routines reduce 'decision fatigue', making it much easier to stay disciplined day after day."
    },
    {
      q: "What is 'delayed gratification'?",
      opts: ["Getting a reward immediately.", "Choosing a smaller reward now.", "Resisting a smaller, immediate reward in order to receive a larger or more enduring reward later.", "Never getting a reward."],
      ans: 2,
      exp: "Discipline heavily relies on delayed gratification, like studying now (hard) to get a good grade later (reward)."
    },
    {
      q: "When trying to focus on studying, what is the best strategy?",
      opts: ["Keep your phone on your desk to check the time.", "Rely purely on your willpower to ignore distractions.", "Remove the distractions entirely, like putting your phone in another room.", "Study while watching a movie."],
      ans: 2,
      exp: "Willpower is finite. True discipline often means intentionally designing your environment to remove temptations."
    }
  ]
};

// Update seedQuizzes.js
let seedQuizzesCode = `require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

const quizData = {
`;

const shortSlugMap = {
  'integrity-foundation': 'integrity',
  'power-of-respect': 'respect',
  'leadership-essentials': 'leadership',
  'taking-responsibility': 'responsibility',
  'practicing-empathy': 'empathy',
  'discipline-focus': 'discipline'
};

for (const [slug, questions] of Object.entries(content)) {
  const shortSlug = shortSlugMap[slug];
  seedQuizzesCode += `  '${slug}': {\n    titleKey: '${shortSlug}_quiz_title',\n    questions: [\n`;
  questions.forEach((q, idx) => {
    seedQuizzesCode += `      {
        questionKey: '${shortSlug}_q${idx+1}_q',
        optionKeys: ['${shortSlug}_q${idx+1}_opt1', '${shortSlug}_q${idx+1}_opt2', '${shortSlug}_q${idx+1}_opt3', '${shortSlug}_q${idx+1}_opt4'],
        correctAnswer: ${q.ans},
        explanationKey: '${shortSlug}_q${idx+1}_exp'
      },
`;
  });
  seedQuizzesCode += `    ]\n  },\n`;
}

seedQuizzesCode += `};

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
`;

fs.writeFileSync(path.join(__dirname, 'src/scripts/seedQuizzes.js'), seedQuizzesCode);


// Update learning.json for all languages
const locales = ['en', 'hi', 'te', 'ta', 'kn', 'ml'];

locales.forEach(locale => {
  const jsonPath = path.join(__dirname, `frontend/src/i18n/translations/${locale}/learning.json`);
  
  let data = {};
  if (fs.existsSync(jsonPath)) {
    data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
  
  // Apply new nav keys
  data.previousQuestion = "Previous Question";
  data.nextQuestion = "Next Question";
  data.takeQuiz = "Take Quiz";
  data.submitQuiz = "Submit Quiz";
  data.quizPassed = "Passed!";
  data.quizFailed = "Failed!";
  data.retryQuiz = "Retry Quiz";
  data.continueLearning = "Continue Learning";
  data.yourScore = "Your Score";
  data.passingScore = "Passing Score";
  data.correctAnswers = "Correct Answers";
  data.wrongAnswers = "Wrong Answers";
  data.xpEarnedLabel = "XP Earned";
  data.questionXofY = "Question {{current}} of {{total}}";
  data.quizResult = "Quiz Result";
  data.loadingQuiz = "Loading Quiz...";
  data.quizSubmitSuccess = "Quiz submitted successfully!";
  data.quizSubmitError = "Failed to submit quiz.";

  for (const [slug, questions] of Object.entries(content)) {
    const shortSlug = shortSlugMap[slug];
    data[`${shortSlug}_quiz_title`] = shortSlug.charAt(0).toUpperCase() + shortSlug.slice(1) + " Assessment";
    questions.forEach((q, idx) => {
      data[`${shortSlug}_q${idx+1}_q`] = q.q;
      data[`${shortSlug}_q${idx+1}_opt1`] = q.opts[0];
      data[`${shortSlug}_q${idx+1}_opt2`] = q.opts[1];
      data[`${shortSlug}_q${idx+1}_opt3`] = q.opts[2];
      data[`${shortSlug}_q${idx+1}_opt4`] = q.opts[3];
      data[`${shortSlug}_q${idx+1}_exp`] = q.exp;
    });
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
});

console.log('Content generated, JSON for all locales and seeder updated successfully.');
