import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlayCircle, CheckCircle, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LessonCard = ({ lesson, isCompleted, isLocked }) => {
  const { t } = useTranslation('learning');
  const navigate = useNavigate();

  return (
    <div 
      className={`p-4 border rounded-xl flex items-center justify-between mb-3 transition-colors ${isCompleted ? 'bg-emerald-900/20 border-emerald-500/30' : isLocked ? 'bg-dark-900/50 border-dark-800 opacity-60' : 'bg-dark-800 border-dark-700 hover:border-primary-500/50 cursor-pointer'}`}
      onClick={() => !isLocked && navigate(`/learning/lesson/${lesson._id}`)}
    >
      <div className="flex items-center gap-4">
        {isCompleted ? (
          <CheckCircle className="w-6 h-6 text-emerald-500" />
        ) : (
          <PlayCircle className="w-6 h-6 text-primary-400" />
        )}
        <div>
          <h4 className={`font-bold ${isCompleted ? 'text-emerald-50' : 'text-white'}`}>{lesson.title}</h4>
          <div className="flex gap-4 text-xs mt-1 text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {lesson.estimatedMinutes} {t('mins', 'mins')}</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500"/> {lesson.xpReward} {t('xp', 'XP')}</span>
          </div>
        </div>
      </div>
      {isCompleted && (
        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
          {t('completed', 'Completed')}
        </span>
      )}
    </div>
  );
};

export default LessonCard;
