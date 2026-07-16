import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Star, PlayCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { showToast } from '../components/ui/Toast';
import learningService from '../services/learningService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Learning = () => {
  const { t } = useTranslation('learning');
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await learningService.getCourses();
        setCourses(response?.data || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        showToast.error(t('fetchError', 'Could not load courses at this time.'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title={t('title', 'Learning Modules')} 
        subtitle={t('subtitle', 'Expand your character knowledge with our curated courses.')} 
        icon={BookOpen} 
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse h-80 bg-dark-900 border-dark-800" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course._id} glass className="flex flex-col h-full group hover:border-primary-500/50 transition-all duration-300">
              {/* Thumbnail Area */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-dark-950 border border-dark-800 flex items-center justify-center">
                <img 
                  src={course.thumbnail || '/course-images/default-course.jpg'} 
                  alt={course.title} 
                  onError={(e) => {
                    e.currentTarget.src = '/course-images/default-course.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Difficulty Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getDifficultyColor(course.difficulty)}`}>
                  {t(course.difficulty.toLowerCase(), course.difficulty)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{t(course.titleKey)}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{t(course.descriptionKey)}</p>
                
                {/* Meta Stats */}
                <div className="flex items-center justify-between py-4 border-t border-dark-800 mb-4">
                  <div className="flex items-center text-slate-300 text-sm">
                    <Clock className="w-4 h-4 mr-2 text-primary-400" />
                    {course.estimatedMinutes} {t('mins', 'mins')}
                  </div>
                  <div className="flex items-center text-slate-300 text-sm font-bold">
                    <Star className="w-4 h-4 mr-2 text-yellow-400 fill-yellow-400" />
                    {course.xpReward} {t('xp', 'XP')}
                  </div>
                </div>

                <Button variant="premium" className="w-full" icon={PlayCircle} onClick={() => navigate(`/learning/course/${course.slug}`)}>
                  {t('startLearning', 'Start Learning')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={BookOpen} 
          title={t('noCoursesTitle', 'No courses available')} 
          description={t('noCoursesDesc', 'We are currently preparing new learning modules. Check back soon!')} 
        />
      )}
    </div>
  );
};

export default Learning;
