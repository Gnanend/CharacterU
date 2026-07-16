import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ArrowLeft, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import learningService from '../services/learningService';
import VideoPlayer from '../components/learning/VideoPlayer';
import { showToast } from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('learning');
  
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await learningService.getLesson(lessonId);
        setLesson(response.data);
        setIsCompleted(response.data.isCompleted || false);
      } catch (err) {
        showToast.error(t('fetchError', 'Could not load lesson.'));
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId, navigate, t]);

  const handleMarkComplete = async () => {
    try {
      setIsCompleting(true);
      const res = await learningService.completeLesson(lessonId);
      setIsCompleted(true);
      showToast.success(t('lessonCompleted', 'Lesson completed successfully!'));
      // In a full implementation, we'd unlock the next lesson or redirect here.
    } catch (err) {
      showToast.error(t('completeError', 'Could not mark lesson as complete.'));
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!lesson) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-slate-400 hover:text-white transition-colors text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Course
      </button>

      <VideoPlayer videoUrl={lesson.videoUrl} />

      <div className="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{lesson.title}</h1>
            <p className="text-slate-300 text-lg">{lesson.description}</p>
            {lesson.content && (
              <div className="mt-6 text-slate-400 prose prose-invert max-w-none">
                {/* Normally parse markdown here, using text for now */}
                {lesson.content}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-4 min-w-[200px] shrink-0 bg-dark-950 p-4 rounded-xl border border-dark-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Reward</span>
              <span className="font-bold text-yellow-400 flex items-center">
                <Award className="w-4 h-4 mr-1" /> {lesson.xpReward} {t('xp', 'XP')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">Time</span>
              <span className="font-bold text-slate-300">{lesson.estimatedMinutes} {t('mins', 'mins')}</span>
            </div>
            
            <Button 
              variant={isCompleted ? "outline" : "premium"}
              className="w-full py-3"
              onClick={handleMarkComplete}
              isLoading={isCompleting}
              disabled={isCompleted}
              icon={isCompleted ? CheckCircle : null}
            >
              {isCompleted ? t('completed', 'Completed') : t('markComplete', 'Mark Complete')}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-6 border-t border-dark-800">
        <Button 
          variant="outline" 
          onClick={() => lesson.prevLessonId && navigate(`/learning/lesson/${lesson.prevLessonId}`)}
          disabled={!lesson.prevLessonId}
        >
          ← {t('previousLesson', 'Previous')}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => lesson.nextLessonId && navigate(`/learning/lesson/${lesson.nextLessonId}`)}
          disabled={!lesson.nextLessonId}
        >
          {t('nextLesson', 'Next')} →
        </Button>
      </div>
    </div>
  );
};

export default LessonViewer;
