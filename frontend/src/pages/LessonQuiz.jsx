import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import learningService from '../services/learningService';
import { toast } from 'react-hot-toast';

import PageHeader from '../components/ui/PageHeader';
import QuizProgress from '../components/learning/QuizProgress';
import QuestionCard from '../components/learning/QuestionCard';
import QuizResult from '../components/learning/QuizResult';
import Button from '../components/ui/Button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const LessonQuiz = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('learning');
  
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [lessonData, setLessonData] = useState(null);
  const [courseSlug, setCourseSlug] = useState('');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        // We also fetch the lesson to get the course slug for navigation
        const lessonResponse = await learningService.getLesson(lessonId);
        setLessonData(lessonResponse.data);
        
        // Since we don't have getCourseByLessonId, we extract slug from lesson/module if possible,
        // or just navigate back to /learning
        // Assuming we pass slug via state or rely on history
        setCourseSlug(lessonResponse.data.module?.course?.slug || 'integrity-foundation'); // Fallback if populate is shallow
        
        const quizResponse = await learningService.getLessonQuiz(lessonId);
        setQuizData(quizResponse.data.quiz);
        setQuestions(quizResponse.data.questions);
      } catch (err) {
        toast.error(t('fetchError', 'Could not load quiz at this time.'));
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuiz();
  }, [lessonId, navigate, t]);

  const handleSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentIndex]._id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer
        }))
      };
      
      const response = await learningService.submitQuiz(lessonId, payload);
      setResult(response.data);
      // response.data contains { attempt, questions }
      // the returned questions include correctAnswer and explanationKey
      setQuestions(response.data.questions);
      
      toast.success(t('quizSubmitSuccess', 'Quiz submitted successfully!'));
    } catch (err) {
      toast.error(t('quizSubmitError', 'Failed to submit quiz.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);
    // Fetch the quiz again to hide answers/explanations
    const resetQuestions = questions.map(q => {
      const { correctAnswer, explanationKey, ...rest } = q;
      return rest;
    });
    setQuestions(resetQuestions);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!quizData || questions.length === 0) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-100">Quiz not available</h2>
          <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader title={t(quizData.titleKey)} subtitle={lessonData?.title} />
      <div className="py-8">
        {!result ? (
          <>
            <QuizProgress 
              current={currentIndex + 1} 
              total={questions.length} 
              percentage={((currentIndex + 1) / questions.length) * 100} 
            />
            
            <QuestionCard 
              question={questions[currentIndex]}
              selectedAnswer={answers[questions[currentIndex]._id]}
              onSelect={handleSelect}
              showResult={false}
            />
            
            <div className="flex justify-between items-center mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                icon={ArrowLeft}
              >
                {t('previousQuestion', 'Previous Question')}
              </Button>
              
              {currentIndex < questions.length - 1 ? (
                <Button 
                  variant="premium" 
                  onClick={handleNext}
                  disabled={answers[questions[currentIndex]._id] === undefined}
                >
                  {t('nextQuestion', 'Next Question')} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  variant="premium" 
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={answers[questions[currentIndex]._id] === undefined}
                  icon={CheckCircle}
                >
                  {t('submitQuiz', 'Submit Quiz')}
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <QuizResult 
              attempt={result.attempt} 
              onRetry={handleRetry} 
              courseSlug={courseSlug}
            />
            
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-slate-100 mb-6">Review Answers</h3>
              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const userAnswer = result.attempt.answers.find(a => a.questionId === q._id)?.selectedAnswer;
                  return (
                    <QuestionCard 
                      key={q._id}
                      question={q}
                      selectedAnswer={userAnswer}
                      showResult={true}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonQuiz;
