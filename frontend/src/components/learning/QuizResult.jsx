import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Trophy, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizResult = ({ attempt, onRetry, courseSlug }) => {
  const { t } = useTranslation('learning');
  const navigate = useNavigate();
  
  const { score, percentage, passed, earnedXP, answers } = attempt;

  return (
    <Card className="p-8 text-center max-w-2xl mx-auto border-t-4 shadow-xl" style={{ borderTopColor: passed ? '#10b981' : '#ef4444' }}>
      <div className="flex justify-center mb-6">
        <div className={`p-4 rounded-full ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {passed ? <Trophy className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-100 mb-2">
        {passed ? t('quizPassed', 'Passed!') : t('quizFailed', 'Failed!')}
      </h2>
      
      <p className="text-slate-400 mb-8">
        You scored <span className="font-bold text-slate-200">{score}</span> points ({percentage}%)
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-dark-800 p-4 rounded-xl">
          <div className="text-sm text-slate-400 mb-1">{t('correctAnswers', 'Correct Answers')}</div>
          <div className="text-2xl font-bold text-green-400">
            {answers.filter(a => a.isCorrect).length || Math.round((percentage / 100) * answers.length)} / {answers.length}
          </div>
        </div>
        <div className="bg-dark-800 p-4 rounded-xl">
          <div className="text-sm text-slate-400 mb-1">{t('xpEarnedLabel', 'XP Earned')}</div>
          <div className="text-2xl font-bold text-primary-400">+{earnedXP}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {!passed && (
          <Button variant="outline" onClick={onRetry} icon={RotateCcw} className="w-full sm:w-auto py-3 px-6">
            {t('retryQuiz', 'Retry Quiz')}
          </Button>
        )}
        <Button 
          variant="premium" 
          onClick={() => navigate(`/learning/course/${courseSlug}`)} 
          icon={ArrowRight}
          className="w-full sm:w-auto py-3 px-6"
        >
          {t('continueLearning', 'Continue Learning')}
        </Button>
      </div>
    </Card>
  );
};

export default QuizResult;
