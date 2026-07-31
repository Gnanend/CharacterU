const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'frontend/src/i18n/translations/en/learning.json');
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Generic Quiz UI
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

// Course Quiz Titles
data.integrity_quiz_title = "Integrity Assessment";
data.respect_quiz_title = "Respect Assessment";
data.leadership_quiz_title = "Leadership Assessment";
data.responsibility_quiz_title = "Responsibility Assessment";
data.empathy_quiz_title = "Empathy Assessment";
data.discipline_quiz_title = "Discipline Assessment";

// Adding some generic questions (since generating 180 keys in node is easier)
const courses = ['integrity', 'respect', 'leadership', 'responsibility', 'empathy', 'discipline'];
for (const course of courses) {
  for (let i = 1; i <= 5; i++) {
    data[`${course}_q${i}_q`] = `Which of the following best demonstrates the core principle of ${course} in this scenario?`;
    data[`${course}_q${i}_opt1`] = `Option A: A negative example.`;
    data[`${course}_q${i}_opt2`] = `Option B: A neutral example.`;
    data[`${course}_q${i}_opt3`] = `Option C: A positive example demonstrating ${course}.`;
    data[`${course}_q${i}_opt4`] = `Option D: An irrelevant action.`;
    data[`${course}_q${i}_exp`] = `The correct answer is Option C, because it actively demonstrates ${course} by prioritizing the right action over personal convenience.`;
  }
}

// Write back
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log('Translations updated successfully.');
