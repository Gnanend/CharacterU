import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import learningService from '../services/learningService';
import LessonCard from '../components/learning/LessonCard';
import ProgressBar from '../components/learning/ProgressBar';
import { showToast } from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('learning');
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await learningService.getCourseBySlug(slug);
        setCourse(response.data);
        
        // Expand first module by default
        if (response.data?.modules?.length > 0) {
          setExpandedModules({ [response.data.modules[0]._id]: true });
        }
      } catch (err) {
        showToast.error(t('fetchError', 'Could not load course.'));
        navigate('/learning');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [slug, navigate, t]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }

  if (!course) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="overflow-hidden border-dark-800 bg-dark-900 shadow-2xl p-0">
        <div className="h-64 relative bg-dark-950">
          <img 
            src={course.thumbnail || '/course-images/default-course.jpg'} 
            className="w-full h-full object-cover opacity-60"
            alt={course.titleKey}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-primary-500/20 text-primary-400 border border-primary-500/30`}>
              {t(course.difficulty.toLowerCase(), course.difficulty)}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t(course.titleKey)}</h1>
            <p className="text-slate-300 max-w-2xl">{t(course.descriptionKey)}</p>
          </div>
        </div>
        
        <div className="p-6 border-t border-dark-800">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-400">{t('overallProgress', 'Overall Progress')}</span>
            <span className="text-primary-400 font-bold">{course.progress?.completionPercentage || 0}%</span>
          </div>
          <ProgressBar progress={course.progress?.completionPercentage || 0} />
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">{t('modules', 'Modules')}</h2>
        
        {course.modules?.map((mod, index) => (
          <Card key={mod._id} className="bg-dark-900 border-dark-800 p-0 overflow-hidden">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-800/50 transition-colors"
              onClick={() => toggleModule(mod._id)}
            >
              <div>
                <h3 className="font-bold text-lg text-white">Module {index + 1}: {mod.title}</h3>
                {mod.description && <p className="text-sm text-slate-400 mt-1">{mod.description}</p>}
              </div>
              {expandedModules[mod._id] ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </div>
            
            {expandedModules[mod._id] && (
              <div className="p-4 border-t border-dark-800 bg-dark-950/50">
                {mod.lessons?.length > 0 ? (
                  mod.lessons.map((lesson) => (
                    <LessonCard 
                      key={lesson._id} 
                      lesson={lesson}
                      isCompleted={course.progress?.completedLessons?.includes(lesson._id)}
                      isLocked={false} // Would need more complex logic if there were prereqs
                    />
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic">{t('noLessons', 'No lessons available yet.')}</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseDetails;
