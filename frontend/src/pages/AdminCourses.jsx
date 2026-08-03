import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Plus, MoreVertical, Edit, Copy, Eye, X,
  Trash2, Globe, Archive, ChevronDown, ChevronUp, GripVertical, CheckCircle, Video, FileText, Download, Link as LinkIcon
} from 'lucide-react';
import { getYoutubeEmbedUrl, getYoutubeVideoId } from '../utils/youtube';
import api from '../services/axiosInstance';
import toast from 'react-hot-toast';

// Helper for classes
const cx = (...classes) => classes.filter(Boolean).join(' ');

function ModuleBuilderStep({ currentCourse }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ _id: null, title: '', description: '' });

  const fetchModules = useCallback(async () => {
    if (!currentCourse?._id) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/courses/${currentCourse._id}`);
      const courseData = res?.data?.data || res?.data;
      if (courseData?.modules) {
        setModules(courseData.modules);
      }
    } catch (err) {
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  }, [currentCourse]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleSave = async () => {
    if (!formData.title) return toast.error('Module Title is required');

    console.log('Save button clicked');
    const payload = {
      title: formData.title,
      description: formData.description,
      course: currentCourse._id,
      order: modules.length
    };

    try {
      if (formData._id) {
        await api.put(`/admin/modules/${formData._id}`, payload);
        toast.success('Module updated');
      } else {
        await api.post(`/admin/modules`, payload);
        toast.success('Module created');
      }
      setIsEditing(false);
      fetchModules();
    } catch (error) {
      toast.error('Failed to save module');
    }
  };

  const handleDelete = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module? This will also delete all its lessons and quizzes.')) return;
    try {
      await api.delete(`/admin/modules/${moduleId}`);
      toast.success('Module deleted');
      fetchModules();
    } catch (err) {
      toast.error('Failed to delete module');
    }
  };

  const handleReorder = async (index, direction) => {
    const newModules = [...modules];
    if (direction === 'up' && index > 0) {
      [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
    } else if (direction === 'down' && index < newModules.length - 1) {
      [newModules[index + 1], newModules[index]] = [newModules[index], newModules[index + 1]];
    } else {
      return;
    }
    
    setModules(newModules); // optimistic UI update
    try {
      const moduleIds = newModules.map(m => m._id);
      await api.patch(`/admin/modules/reorder`, { moduleIds });
      toast.success('Modules reordered');
    } catch (err) {
      toast.error('Failed to reorder modules');
      fetchModules(); // revert on fail
    }
  };

  const handleEdit = (module) => {
    setFormData({ _id: module._id, title: module.title, description: module.description || '' });
    setIsEditing(true);
  };

  const openNew = () => {
    setFormData({ _id: null, title: '', description: '' });
    setIsEditing(true);
  };

  if (!currentCourse?._id) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
          <h3 className="text-lg font-semibold text-white">Curriculum Modules</h3>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-center py-8">Save basic information first to begin adding modules.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="text-lg font-semibold text-white">Curriculum Modules</h3>
        {!isEditing && (
          <button onClick={openNew} className="text-sm px-3 py-1 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded flex items-center transition-colors">
            <Plus className="w-4 h-4 mr-1" /> Add Module
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading modules...</div>
      ) : isEditing ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4 animate-in fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Module Title *</label>
            <input type="text" value={formData.title ?? ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" placeholder="e.g. Getting Started" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Description (Optional)</label>
            <textarea value={formData.description ?? ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white h-24" placeholder="Brief overview of this module..." />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setIsEditing(false)} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Cancel</button>
            <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">Save Module</button>
          </div>
        </div>
      ) : modules.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700/50 border-dashed rounded-xl p-10 text-center">
          <p className="text-gray-400 font-medium">No modules created yet.</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">Start organizing your course content by creating a module.</p>
          <button onClick={openNew} className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-lg transition-colors">
            Add First Module
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((module, index) => (
            <div key={module._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-xl group">
              <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center shrink-0 border border-gray-700">
                  <span className="text-gray-400 font-bold text-sm">M{index + 1}</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">{module.title}</h4>
                  {module.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{module.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button onClick={() => handleReorder(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-30">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => handleReorder(index, 'down')} disabled={index === modules.length - 1} className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-30">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-700 mx-1"></div>
                <button onClick={() => handleEdit(module)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(module._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LessonBuilderStep({ currentCourse }) {
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: null,
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    content: '',
    lessonType: 'Video',
    freePreview: false
  });

  const fetchModulesAndLessons = useCallback(async () => {
    if (!currentCourse?._id) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/courses/${currentCourse._id}`);
      const courseData = res?.data?.data || res?.data;
      if (courseData?.modules) {
        setModules(courseData.modules);
        if (courseData.modules.length > 0 && !selectedModule) {
          setSelectedModule(courseData.modules[0]._id);
        }
      }
    } catch (err) {
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  }, [currentCourse, selectedModule]);

  useEffect(() => {
    console.log('Refreshing lesson list');
      fetchModulesAndLessons();
  }, [fetchModulesAndLessons]);

  const activeModule = modules.find(m => m._id === selectedModule);
  const activeLessons = activeModule?.lessons || [];
  console.table(activeLessons);

  const handleSave = async () => {
    if (!formData.title) return toast.error('Lesson Title is required');
    if (formData.duration && Number(formData.duration) <= 0) return toast.error('Duration must be positive');
    if (!selectedModule) return toast.error('Please select a module first');

    const payload = {
      title: formData.title,
      description: formData.description || '',
      videoUrl: formData.videoUrl || '',
      duration: Number(formData.duration) || 0,
      content: formData.content || '',
      lessonType: formData.lessonType || 'Video',
      freePreview: formData.freePreview || false,
      module: selectedModule,
      order: activeLessons.length
    };

    try {
      if (formData._id) {
        await api.put(`/admin/lessons/${formData._id}`, payload);
        toast.success('Lesson updated');
      } else {
        await api.post(`/admin/lessons`, payload);
        toast.success('Lesson created');
      }
      setIsEditing(false);
      fetchModulesAndLessons();
    } catch (error) {
      toast.error('Failed to save lesson');
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await api.delete(`/admin/lessons/${lessonId}`);
      toast.success('Lesson deleted');
      fetchModulesAndLessons();
    } catch (err) {
      toast.error('Failed to delete lesson');
    }
  };

  const handleEdit = (lesson) => {
    setFormData({
      _id: lesson._id,
      title: lesson.title,
      description: lesson.description || '',
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || '',
      content: lesson.content || '',
      lessonType: lesson.lessonType || 'Video',
      freePreview: lesson.freePreview || false
    });
    setIsEditing(true);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('lessonIndex', index);
  };

  const handleDrop = async (e, dropIndex) => {
    const dragIndex = Number(e.dataTransfer.getData('lessonIndex'));
    if (dragIndex === dropIndex) return;

    const newLessons = [...activeLessons];
    const draggedLesson = newLessons[dragIndex];
    newLessons.splice(dragIndex, 1);
    newLessons.splice(dropIndex, 0, draggedLesson);
    
    // Update local state optimistically
    const updatedModules = [...modules];
    const moduleIndex = updatedModules.findIndex(m => m._id === selectedModule);
    if (moduleIndex > -1) {
      updatedModules[moduleIndex].lessons = newLessons;
      setModules(updatedModules);
    }

    try {
      await api.patch('/admin/lessons/reorder', {
        lessonIds: newLessons.map(l => l._id)
      });
      toast.success('Lessons reordered');
    } catch (err) {
      toast.error('Failed to reorder lessons');
      fetchModulesAndLessons(); // Revert on failure
    }
  };

  const openNew = () => {
    if (!selectedModule) return toast.error('Please select a module first');
    setFormData({ _id: null, title: '', description: '', videoUrl: '', duration: '', content: '', lessonType: 'Video', freePreview: false });
    setIsEditing(true);
  };

  if (!currentCourse?._id) {
    return <div className="text-gray-400 text-center py-8">Save basic course information first to manage lessons.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-4">
        <h3 className="text-lg font-semibold text-white">Lesson Management</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={selectedModule} 
            onChange={(e) => setSelectedModule(e.target.value)}
            className="flex-1 sm:w-64 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-white"
          >
            <option value="" disabled>Select a Module</option>
            {modules.map(m => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </select>
          {!isEditing && (
            <button onClick={openNew} className="text-sm px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded flex items-center transition-colors whitespace-nowrap">
              <Plus className="w-4 h-4 mr-1" /> Add Lesson
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading lessons...</div>
      ) : isEditing ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Lesson Title *</label>
              <input type="text" value={formData.title ?? ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" placeholder="e.g. Introduction to React" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Lesson Type</label>
              <select value={formData.lessonType ?? 'Video'} onChange={e => setFormData({...formData, lessonType: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white">
                <option value="Video">Video</option>
                <option value="Reading">Reading</option>
                <option value="Assignment">Assignment</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
              <input type="text" value={formData.description ?? ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" placeholder="Brief lesson overview..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Video URL</label>
              <input type="url" value={formData.videoUrl ?? ''} onChange={e => setFormData({...formData, videoUrl: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" placeholder="https://..." />
              {formData.videoUrl && formData.videoUrl.trim() !== '' && (
                <div className="mt-3 aspect-video bg-gray-900 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                  {getYoutubeEmbedUrl(formData.videoUrl) ? (
                    <iframe
                      src={getYoutubeEmbedUrl(formData.videoUrl)}
                      title="YouTube video preview"
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  ) : (
                    <p className="text-red-400 text-sm">Invalid YouTube URL</p>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Estimated Duration (mins)</label>
              <input type="number" min="1" value={formData.duration ?? ''} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" placeholder="15" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Rich Text Content</label>
              <textarea value={formData.content ?? ''} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white h-32" placeholder="Lesson content goes here..." />
            </div>
            <div className="col-span-2 flex items-center mt-2">
              <input type="checkbox" id="freePreview" checked={formData.freePreview} onChange={e => setFormData({...formData, freePreview: e.target.checked})} className="w-4 h-4 text-indigo-600 bg-gray-900 border-gray-700 rounded focus:ring-indigo-600 focus:ring-offset-gray-900" />
              <label htmlFor="freePreview" className="ml-2 text-sm text-gray-300">Free Preview (Allow unregistered users to view)</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
            <button onClick={() => setIsEditing(false)} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-900/20">Save Lesson</button>
          </div>
        </div>
      ) : activeLessons.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700/50 border-dashed rounded-xl p-10 text-center">
          <Video className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No lessons in this module yet.</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">Create your first lesson to build out the curriculum.</p>
          <button onClick={openNew} className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-lg transition-colors">
            Add First Lesson
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeLessons.map((lesson, index) => (
            <div 
              key={lesson._id} 
              draggable 
              onDragStart={(e) => handleDragStart(e, index)} 
              onDragOver={(e) => e.preventDefault()} 
              onDrop={(e) => handleDrop(e, index)}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors group"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white p-1">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center shrink-0 border border-gray-700">
                  <span className="text-gray-400 font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <h4 className="text-white font-medium group-hover:text-indigo-400 transition-colors">{lesson.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center"><Video className="w-3 h-3 mr-1" /> {lesson.lessonType || 'Video'}</span>
                    <span className="flex items-center">⏱ {lesson.duration || 0} mins</span>
                    {lesson.freePreview && <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-green-500/20">Preview</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button onClick={() => handleEdit(lesson)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(lesson._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourcesBuilderStep({ currentCourse }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'link'
  
  const [formData, setFormData] = useState({
    _id: null,
    title: '',
    url: '',
    file: null
  });

  const fetchResources = useCallback(async () => {
    if (!currentCourse?._id) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/resources/${currentCourse._id}`);
      setResources(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [currentCourse]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const openNew = () => {
    setFormData({ _id: null, title: '', url: '', file: null });
    setActiveTab('file');
    setIsModalOpen(true);
  };

  const handleEdit = (resource) => {
    setFormData({
      _id: resource._id,
      title: resource.title,
      url: resource.url || '',
      file: null
    });
    setActiveTab(resource.type);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.delete(`/admin/resources/${id}`);
      toast.success('Resource deleted');
      fetchResources();
    } catch (err) {
      toast.error('Failed to delete resource');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error('Title is required');
    if (activeTab === 'link' && !formData.url) return toast.error('URL is required for links');
    if (activeTab === 'file' && !formData._id && !formData.file) return toast.error('File is required');

    const form = new FormData();
    form.append('course', currentCourse._id);
    form.append('title', formData.title);
    form.append('type', activeTab);
    
    if (activeTab === 'link') {
      form.append('url', formData.url);
    } else if (activeTab === 'file' && formData.file) {
      form.append('file', formData.file);
    }

    try {
      if (formData._id) {
        await api.put(`/admin/resources/${formData._id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Resource updated');
      } else {
        await api.post(`/admin/resources`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Resource created');
      }
      setIsModalOpen(false);
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save resource');
    }
  };

  if (!currentCourse?._id) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Resources</h3>
        <p className="text-gray-400">Save basic information first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="text-lg font-semibold text-white">Downloadable Resources</h3>
        <button onClick={openNew} className="text-sm px-3 py-1 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-1" /> Add Resource
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-4">Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700/50 border-dashed rounded-xl p-10 text-center">
          <p className="text-gray-400 font-medium">No resources have been added yet.</p>
          <button onClick={openNew} className="mt-4 text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-lg transition-colors">
            Add Resource
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map(res => (
            <div key={res._id} className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                {res.type === 'file' ? <FileText className="text-blue-400" /> : <LinkIcon className="text-green-400" />}
                <div>
                  <p className="text-white font-medium text-sm">{res.title}</p>
                  <p className="text-gray-500 text-xs">
                    {res.type === 'file' ? `${res.fileName} • ${(res.fileSize / (1024 * 1024)).toFixed(2)} MB` : `External Link • ${res.url}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 text-gray-400">
                <button onClick={() => handleEdit(res)} className="p-2 hover:text-white hover:bg-gray-700 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(res._id)} className="p-2 hover:text-red-400 hover:bg-gray-700 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
              <h2 className="text-lg font-bold text-white">{formData._id ? 'Edit Resource' : 'Add Resource'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-4 border-b border-gray-800 mb-6">
                <button onClick={() => setActiveTab('file')} className={cx("pb-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'file' ? "border-indigo-500 text-indigo-400" : "border-transparent text-gray-400 hover:text-white")}>Upload File</button>
                <button onClick={() => setActiveTab('link')} className={cx("pb-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'link' ? "border-indigo-500 text-indigo-400" : "border-transparent text-gray-400 hover:text-white")}>External Link</button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Title *</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" placeholder="e.g. Course Syllabus" required />
                </div>
                
                {activeTab === 'file' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">File {formData._id ? '(Leave blank to keep existing)' : '*'}</label>
                    <input type="file" onChange={e => setFormData({...formData, file: e.target.files[0]})} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip" required={!formData._id} />
                    <p className="text-xs text-gray-500 mt-2">Supported formats: pdf, doc, docx, ppt, xls, zip. Max 25MB.</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">URL *</label>
                    <input type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" placeholder="https://..." required />
                  </div>
                )}
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium">{formData._id ? 'Update' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizBuilderStep({ currentCourse }) {
  const [modules, setModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState('');
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  
  const [quizForm, setQuizForm] = useState({
    title: '', description: '', passingScore: 70, timeLimit: 0, shuffleQuestions: false, allowRetry: true
  });

  const [questions, setQuestions] = useState([]);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [questionForm, setQuestionForm] = useState(null);

  // Fetch course structure
  useEffect(() => {
    const fetchCourseStructure = async () => {
      if (!currentCourse?._id) return;
      try {
        const res = await api.get(`/admin/courses/${currentCourse._id}`);
        const courseData = res?.data?.data || res?.data;
        if (courseData?.modules) {
          setModules(courseData.modules);
          let firstLesson = null;
          for (const m of courseData.modules) {
            if (m.lessons && m.lessons.length > 0) {
              firstLesson = m.lessons[0]._id;
              break;
            }
          }
          if (firstLesson && !selectedLesson) setSelectedLesson(firstLesson);
        }
      } catch (err) {
        toast.error('Failed to load course structure');
      }
    };
    fetchCourseStructure();
  }, [currentCourse]);

  // Fetch quiz for selected lesson
  const fetchQuizData = useCallback(async () => {
    if (!selectedLesson) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/quizzes/${selectedLesson}`);
      if (res.data) {
        const qz = res.data;
        setQuiz(qz);
        setQuizForm({
          title: qz.title || '',
          description: qz.description || '',
          passingScore: qz.passingScore || 70,
          timeLimit: qz.timeLimit || 0,
          shuffleQuestions: qz.shuffleQuestions || false,
          allowRetry: qz.allowRetry !== false
        });
        
        const qRes = await api.get(`/admin/questions/${qz._id}`);
        setQuestions(qRes.data || []);
      } else {
        setQuiz(null);
        setQuestions([]);
        setQuizForm({
          title: '', description: '', passingScore: 70, timeLimit: 0, shuffleQuestions: false, allowRetry: true
        });
      }
    } catch (err) {
      toast.error('Failed to fetch quiz data');
    } finally {
      setLoading(false);
    }
  }, [selectedLesson]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title) return toast.error('Quiz title is required');
    if (quizForm.passingScore < 0 || quizForm.passingScore > 100) return toast.error('Passing score must be between 0 and 100');
    
    const payload = {
      ...quizForm,
      lesson: selectedLesson,
      titleKey: quizForm.title // Fallback for old schema requirement
    };

    try {
      if (quiz?._id) {
        await api.put(`/admin/quizzes/${quiz._id}`, payload);
        toast.success('Quiz updated');
      } else {
        await api.post(`/admin/quizzes`, payload);
        toast.success('Quiz created');
      }
      setIsEditingQuiz(false);
      fetchQuizData();
    } catch (err) {
      toast.error('Failed to save quiz');
    }
  };

  const openNewQuestion = () => {
    setQuestionForm({
      _id: null,
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      correctAnswers: [],
      explanation: '',
      points: 1
    });
    setIsEditingQuestion(true);
  };

  const handleEditQuestion = (q) => {
    setQuestionForm({
      _id: q._id,
      type: q.type || 'multiple_choice',
      question: q.question,
      options: q.options && q.options.length > 0 ? q.options : ['', '', '', ''],
      correctAnswer: q.correctAnswer ?? 0,
      correctAnswers: q.correctAnswers || [],
      explanation: q.explanation || '',
      points: q.points || 1
    });
    setIsEditingQuestion(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      toast.success('Question deleted');
      fetchQuizData();
    } catch (err) {
      toast.error('Failed to delete question');
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.question) return toast.error('Question text is required');
    
    if (questionForm.type === 'multiple_choice') {
      if (questionForm.options.some(o => !o.trim())) return toast.error('All 4 options are required');
    } else if (questionForm.type === 'true_false') {
      questionForm.options = ['True', 'False'];
    } else if (questionForm.type === 'multiple_select') {
      if (questionForm.options.some(o => !o.trim())) return toast.error('All 4 options are required');
      if (questionForm.correctAnswers.length === 0) return toast.error('Select at least one correct answer');
    }

    const payload = {
      ...questionForm,
      quiz: quiz._id,
      order: questionForm._id ? undefined : questions.length
    };

    try {
      if (questionForm._id) {
        await api.put(`/admin/questions/${questionForm._id}`, payload);
        toast.success('Question updated');
      } else {
        await api.post(`/admin/questions`, payload);
        toast.success('Question created');
      }
      setIsEditingQuestion(false);
      fetchQuizData();
    } catch (err) {
      toast.error('Failed to save question');
    }
  };

  const handleReorderQuestion = async (index, direction) => {
    const newQ = [...questions];
    if (direction === 'up' && index > 0) {
      [newQ[index - 1], newQ[index]] = [newQ[index], newQ[index - 1]];
    } else if (direction === 'down' && index < newQ.length - 1) {
      [newQ[index + 1], newQ[index]] = [newQ[index], newQ[index + 1]];
    } else {
      return;
    }
    setQuestions(newQ);
    try {
      await api.patch(`/admin/questions/reorder`, { questionIds: newQ.map(q => q._id) });
      toast.success('Questions reordered');
    } catch (err) {
      toast.error('Failed to reorder');
      fetchQuizData();
    }
  };

  if (!currentCourse?._id) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Quiz Builder</h3>
        <p className="text-gray-400">Save basic information first.</p>
      </div>
    );
  }

  const allLessons = modules.flatMap(m => m.lessons || []).map(l => ({ ...l, moduleTitle: modules.find(mo => mo._id === l.module)?.title }));

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700">
        <label className="text-sm font-medium text-gray-400 shrink-0">Select Lesson:</label>
        <select 
          value={selectedLesson} 
          onChange={(e) => setSelectedLesson(e.target.value)}
          className="flex-1 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
        >
          {allLessons.map(l => (
            <option key={l._id} value={l._id}>{l.moduleTitle ? `${l.moduleTitle} - ${l.title}` : l.title}</option>
          ))}
          {allLessons.length === 0 && <option value="">No lessons available</option>}
        </select>
      </div>

      {!selectedLesson ? (
        <div className="text-center p-8 text-gray-500">Please select a lesson to manage its quiz.</div>
      ) : loading ? (
        <div className="text-center p-8 text-gray-400">Loading quiz data...</div>
      ) : !quiz && !isEditingQuiz ? (
        <div className="bg-gray-800/50 border border-gray-700/50 border-dashed rounded-xl p-10 text-center">
          <p className="text-gray-400 font-medium">No quiz created yet.</p>
          <button onClick={() => setIsEditingQuiz(true)} className="mt-4 text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg shadow-indigo-900/20">
            Create Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Quiz Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2 mb-4">Quiz Settings</h3>
            <form onSubmit={handleSaveQuiz} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title *</label>
                <input type="text" value={quizForm.title} onChange={e => setQuizForm({...quizForm, title: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea value={quizForm.description} onChange={e => setQuizForm({...quizForm, description: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Passing Score (%)</label>
                  <input type="number" min="0" max="100" value={quizForm.passingScore} onChange={e => setQuizForm({...quizForm, passingScore: Number(e.target.value)})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Time Limit (mins, 0 = unlimited)</label>
                  <input type="number" min="0" value={quizForm.timeLimit} onChange={e => setQuizForm({...quizForm, timeLimit: Number(e.target.value)})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" />
                </div>
              </div>
              <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" checked={quizForm.shuffleQuestions} onChange={e => setQuizForm({...quizForm, shuffleQuestions: e.target.checked})} className="rounded bg-gray-900 border-gray-700 text-indigo-600 focus:ring-indigo-600" />
                  Shuffle Questions
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" checked={quizForm.allowRetry} onChange={e => setQuizForm({...quizForm, allowRetry: e.target.checked})} className="rounded bg-gray-900 border-gray-700 text-indigo-600 focus:ring-indigo-600" />
                  Allow Retry
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium">{quiz ? 'Save Quiz Settings' : 'Save Quiz'}</button>
              </div>
            </form>
          </div>

          {/* Question Builder */}
          {quiz && (
            <div className="space-y-6 pt-4 border-t-2 border-gray-800/50">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <h3 className="text-xl font-bold text-white">Questions</h3>
                {!isEditingQuestion && (
                  <button onClick={openNewQuestion} className="text-sm px-4 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg flex items-center transition-colors">
                    <Plus className="w-4 h-4 mr-1" /> Add Question
                  </button>
                )}
              </div>

          {isEditingQuestion ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <div className="flex flex-wrap gap-4 mb-4">
                  <label className="flex items-center gap-2 text-gray-300">
                    <input type="radio" name="qType" checked={questionForm.type === 'multiple_choice'} onChange={() => setQuestionForm({...questionForm, type: 'multiple_choice'})} className="text-indigo-600 bg-gray-900 border-gray-700" />
                    Multiple Choice
                  </label>
                  <label className="flex items-center gap-2 text-gray-300">
                    <input type="radio" name="qType" checked={questionForm.type === 'true_false'} onChange={() => setQuestionForm({...questionForm, type: 'true_false'})} className="text-indigo-600 bg-gray-900 border-gray-700" />
                    True / False
                  </label>
                  <label className="flex items-center gap-2 text-gray-300">
                    <input type="radio" name="qType" checked={questionForm.type === 'multiple_select'} onChange={() => setQuestionForm({...questionForm, type: 'multiple_select'})} className="text-indigo-600 bg-gray-900 border-gray-700" />
                    Multiple Select
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Question Text *</label>
                  <input type="text" value={questionForm.question} onChange={e => setQuestionForm({...questionForm, question: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" required />
                </div>

                {questionForm.type === 'true_false' ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-400">Select Correct Answer</label>
                    {['True', 'False'].map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input type="radio" name="correctTF" checked={questionForm.correctAnswer === idx} onChange={() => setQuestionForm({...questionForm, correctAnswer: idx})} className="w-4 h-4 text-indigo-600 bg-gray-900 border-gray-700" />
                        <span className="text-white">{opt}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-400">Options * (Check the correct answer/s)</label>
                    {[0, 1, 2, 3].map(idx => (
                      <div key={idx} className="flex items-center gap-3">
                        {questionForm.type === 'multiple_select' ? (
                          <input type="checkbox" checked={questionForm.correctAnswers.includes(idx)} onChange={(e) => {
                            const newAns = e.target.checked ? [...questionForm.correctAnswers, idx] : questionForm.correctAnswers.filter(a => a !== idx);
                            setQuestionForm({...questionForm, correctAnswers: newAns});
                          }} className="w-4 h-4 rounded text-indigo-600 bg-gray-900 border-gray-700" />
                        ) : (
                          <input type="radio" name="correctMC" checked={questionForm.correctAnswer === idx} onChange={() => setQuestionForm({...questionForm, correctAnswer: idx})} className="w-4 h-4 text-indigo-600 bg-gray-900 border-gray-700" />
                        )}
                        <input type="text" value={questionForm.options[idx] || ''} onChange={e => {
                          const newOpt = [...questionForm.options];
                          newOpt[idx] = e.target.value;
                          setQuestionForm({...questionForm, options: newOpt});
                        }} className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" placeholder={`Option ${idx + 1}`} required={questionForm.type !== 'true_false'} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Points</label>
                    <input type="number" min="1" value={questionForm.points} onChange={e => setQuestionForm({...questionForm, points: Number(e.target.value)})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">Explanation (Optional)</label>
                  <textarea value={questionForm.explanation} onChange={e => setQuestionForm({...questionForm, explanation: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white h-20" />
                </div>
                
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-800">
                  <button type="button" onClick={() => setIsEditingQuestion(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded">{questionForm._id ? 'Update Question' : 'Save Question'}</button>
                </div>
              </form>
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700/50 border-dashed rounded-xl p-10 text-center">
              <p className="text-gray-400 font-medium">No questions added yet.</p>
              <button onClick={openNewQuestion} className="mt-4 text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-lg">
                Add Question
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, index) => (
                <div key={q._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-xl group">
                  <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0 border border-gray-700">
                      <span className="text-gray-400 font-bold text-xs">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{q.question}</h4>
                      <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{q.type.replace('_', ' ')} • {q.points} pts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button onClick={() => handleReorderQuestion(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-30">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleReorderQuestion(index, 'down')} disabled={index === questions.length - 1} className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-30">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-700 mx-1"></div>
                    <button onClick={() => handleEditQuestion(q)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteQuestion(q._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
        </div>
      )}
    </div>
  );
}

function CoursePreviewStep({ currentCourse, setActiveStep }) {
  const modules = currentCourse?.modules || [];
  const resources = currentCourse?.resources || [];
  
  const totalMins = modules.reduce((acc, m) => acc + (m.lessons || []).reduce((lAcc, l) => lAcc + (Number(l.duration) || 0), 0), 0);
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons || []).length, 0);
  const totalQuizzes = modules.reduce((acc, m) => acc + (m.lessons || []).filter(l => l.quiz).length, 0);
  const totalQuestions = modules.reduce((acc, m) => acc + (m.lessons || []).reduce((qAcc, l) => qAcc + (l.quiz?.questions?.length || 0), 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Course Preview</h3>
      
      {/* SECTION 1: Banner & Info */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
        <div className="h-64 bg-gray-700 relative">
          {currentCourse?.thumbnail ? (
            <img src={currentCourse.thumbnail} className="w-full h-full object-cover" alt="Course Thumbnail" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col text-gray-500">
              <Video className="w-16 h-16 mb-2 opacity-50" />
              <p>No Thumbnail</p>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-3 py-1 bg-gray-900/80 text-white text-xs font-semibold rounded-full backdrop-blur-sm border border-gray-700">
              {currentCourse?.category || 'Uncategorized'}
            </span>
            <span className="px-3 py-1 bg-indigo-600/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm border border-indigo-500">
              {currentCourse?.difficulty || 'Beginner'}
            </span>
          </div>
        </div>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-3">{currentCourse?.title || currentCourse?.titleKey || 'Untitled Course'}</h1>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">{currentCourse?.shortDescription || currentCourse?.descriptionKey || 'No description provided.'}</p>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Instructor:</span> {currentCourse?.instructor?.fullName || 'Platform AI'}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Duration:</span> {Math.floor(totalMins / 60)}h {totalMins % 60}m
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Certificate:</span> <CheckCircle className="w-4 h-4 text-green-400" /> Eligible
            </div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              +{currentCourse?.xpReward || 500} XP
            </div>
            <div className="flex items-center gap-2 text-green-400 font-semibold">
              +{currentCourse?.characterPoints || 10} CP
            </div>
          </div>

          {/* SECTION 2 & 3: Outcomes & Prerequisites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">Learning Outcomes</h4>
              <ul className="space-y-2">
                {(currentCourse?.learningOutcomes || []).length > 0 ? (
                  currentCourse.learningOutcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      {outcome}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-sm italic">No outcomes defined.</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">Prerequisites</h4>
              <ul className="space-y-2">
                {(currentCourse?.prerequisites || []).length > 0 ? (
                  currentCourse.prerequisites.map((prereq, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                      {prereq}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-sm italic">No prerequisites defined.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Course Structure */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        <h4 className="text-xl font-bold text-white mb-6">Course Structure</h4>
        <div className="space-y-4">
          {modules.length > 0 ? modules.map((mod, i) => (
            <div key={i} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900/50">
              <div className="p-4 bg-gray-800/80 border-b border-gray-700 flex justify-between items-center cursor-pointer">
                <h5 className="font-semibold text-white">Module {i + 1}: {mod.title}</h5>
                <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded-md">{(mod.lessons || []).length} Lessons</span>
              </div>
              <div className="p-4 space-y-3">
                {(mod.lessons || []).length > 0 ? mod.lessons.map((les, j) => (
                  <div key={j} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        {j + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{les.title}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <Video className="w-3 h-3" /> {les.duration || 0} mins
                        </p>
                      </div>
                    </div>
                    {les.isPreview && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-md font-medium">Free Preview</span>
                    )}
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic px-2">No lessons in this module.</p>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg text-gray-500">
              No modules defined for this course.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5: Resources */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        <h4 className="text-xl font-bold text-white mb-6">Course Resources</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.length > 0 ? resources.map((res, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              {res.type === 'link' ? <LinkIcon className="w-5 h-5 text-indigo-400 shrink-0" /> : <FileText className="w-5 h-5 text-pink-400 shrink-0" />}
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{res.title}</p>
                <p className="text-xs text-gray-500 truncate">{res.url || res.fileName}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-6 border border-dashed border-gray-700 rounded-lg text-gray-500">
              No resources attached.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 6: Quiz Preview */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        <h4 className="text-xl font-bold text-white mb-6">Quiz Previews</h4>
        <div className="space-y-6">
          {modules.map(m => (m.lessons || []).map(l => l.quiz ? (
            <div key={l.quiz._id || l._id} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900/30">
              <div className="p-5 bg-indigo-900/20 border-b border-indigo-900/50">
                <h5 className="font-bold text-indigo-300 text-lg mb-2">{l.quiz.title || l.quiz.titleKey || 'Assessment'}</h5>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span className="bg-gray-900 px-2 py-1 rounded">Passing Score: {l.quiz.passingScore}%</span>
                  <span className="bg-gray-900 px-2 py-1 rounded">Time Limit: {l.quiz.timeLimit ? `${l.quiz.timeLimit} mins` : 'None'}</span>
                  <span className="bg-gray-900 px-2 py-1 rounded">Questions: {(l.quiz.questions || []).length}</span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {(l.quiz.questions || []).length > 0 ? l.quiz.questions.map((q, qIndex) => (
                  <div key={qIndex} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300 font-medium mb-3"><span className="text-gray-500 mr-2">{qIndex + 1}.</span> {q.question || q.questionKey}</p>
                    <div className="space-y-2 pl-6">
                      {(q.options || q.optionKeys || []).map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2 text-xs">
                          <div className={`w-3 h-3 rounded-full border ${q.correctAnswer === oIndex ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}></div>
                          <span className={q.correctAnswer === oIndex ? 'text-green-400 font-medium' : 'text-gray-400'}>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">No questions added yet.</p>
                )}
              </div>
            </div>
          ) : null))}
          {totalQuizzes === 0 && (
            <div className="text-center py-6 border border-dashed border-gray-700 rounded-lg text-gray-500">
              No quizzes configured in this course.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 7: Course Statistics & SECTION 8: Publish Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-bold text-white mb-4">Course Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 text-center">
              <p className="text-2xl font-bold text-indigo-400 mb-1">{modules.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Modules</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 text-center">
              <p className="text-2xl font-bold text-pink-400 mb-1">{totalLessons}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Lessons</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 text-center">
              <p className="text-2xl font-bold text-blue-400 mb-1">{totalQuizzes}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Quizzes</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 text-center">
              <p className="text-2xl font-bold text-green-400 mb-1">{totalQuestions}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Questions</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 text-center">
              <p className="text-2xl font-bold text-yellow-400 mb-1">{resources.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Resources</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 text-center">
              <p className="text-2xl font-bold text-purple-400 mb-1">{Math.floor(totalMins / 60)}h</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Est. Time</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
          <h4 className="text-lg font-bold text-white mb-6">Current Status</h4>
          <div className="mb-4">
            {currentCourse?.status === 'published' ? (
              <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-green-400" />
              </div>
            ) : currentCourse?.status === 'archived' ? (
              <div className="w-24 h-24 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center mx-auto mb-4">
                <Archive className="w-10 h-10 text-red-400" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-yellow-500/20 border-4 border-yellow-500 flex items-center justify-center mx-auto mb-4">
                <Edit className="w-10 h-10 text-yellow-400" />
              </div>
            )}
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${
            currentCourse?.status === 'published' ? 'bg-green-500/20 text-green-400' :
            currentCourse?.status === 'archived' ? 'bg-red-500/20 text-red-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {currentCourse?.status || 'Draft'}
          </span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-800">
        <button onClick={() => setActiveStep(5)} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors border border-gray-700">
          Previous
        </button>
        <button onClick={() => setActiveStep(7)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-900/20">
          Continue to Publish
        </button>
      </div>
    </div>
  );
}

function CoursePublishStep({ currentCourse, setCurrentCourse, setCourses, setActiveStep, setIsBuilderOpen }) {
  const [isPublishing, setIsPublishing] = useState(false);
  
  const modules = currentCourse?.modules || [];
  const resources = currentCourse?.resources || [];
  const totalMins = modules.reduce((acc, m) => acc + (m.lessons || []).reduce((lAcc, l) => lAcc + (Number(l.duration) || 0), 0), 0);
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons || []).length, 0);
  const totalQuizzes = modules.reduce((acc, m) => acc + (m.lessons || []).filter(l => l.quiz).length, 0);
  const totalQuestions = modules.reduce((acc, m) => acc + (m.lessons || []).reduce((qAcc, l) => qAcc + (l.quiz?.questions?.length || 0), 0), 0);

  const validations = {
    basicInfo: !!(currentCourse?.title && currentCourse?.category && currentCourse?.difficulty && currentCourse?.shortDescription),
    hasModule: modules.length > 0,
    hasLessons: modules.length > 0 && modules.every(m => m.lessons && m.lessons.length > 0),
    hasQuiz: totalQuizzes > 0,
    hasQuestions: modules.every(m => (m.lessons || []).every(l => !l.quiz || (l.quiz.questions && l.quiz.questions.length > 0))),
    hasThumbnail: !!currentCourse?.thumbnail,
    hasOutcomes: !!(currentCourse?.learningOutcomes && currentCourse.learningOutcomes.length > 0),
    hasPrereqs: !!(currentCourse?.prerequisites && currentCourse.prerequisites.length > 0),
    hasDuration: totalMins > 0,
    resourcesOptional: resources.length > 0
  };

  const validationErrors = [];
  if (!validations.basicInfo) validationErrors.push("Basic information is incomplete (title, description, category, difficulty)");
  if (!validations.hasModule) validationErrors.push("No modules created");
  if (modules.length > 0 && !validations.hasLessons) validationErrors.push("Every module must have at least one lesson");
  if (!validations.hasQuiz) validationErrors.push("At least one quiz is required");
  if (totalQuizzes > 0 && !validations.hasQuestions) validationErrors.push("Every quiz must contain at least one question");
  if (!validations.hasThumbnail) validationErrors.push("Course thumbnail missing");
  if (!validations.hasOutcomes) validationErrors.push("Learning Outcomes missing");
  if (!validations.hasPrereqs) validationErrors.push("Prerequisites missing");
  if (!validations.hasDuration) validationErrors.push("Estimated duration is zero (lessons must have duration)");

  const isReady = validationErrors.length === 0;

  const updateCourseStatus = async (status) => {
    if (status === 'published' && !isReady) return toast.error('Cannot publish. Resolve validation errors.');
    
    setIsPublishing(true);
    try {
      const res = await api.put(`/admin/courses/${currentCourse._id}`, {
        status: status,
        isPublished: status === 'published'
      });
      
      const updated = res.data?.data || res.data;
      
      setCurrentCourse({ ...currentCourse, status: updated.status, isPublished: updated.isPublished });
      setCourses(prev => prev.map(c => c._id === currentCourse._id ? { ...c, status: updated.status, isPublished: updated.isPublished } : c));
      
      toast.success(status === 'published' ? 'Course published successfully!' : `Course status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update course status');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Publish & Go Live</h3>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* SECTION 1: Pre-flight Checklist */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg h-fit">
          <h4 className="text-lg font-bold text-white mb-6">Pre-Publish Checklist</h4>
          <div className="space-y-4">
            <ChecklistItem checked={validations.basicInfo} text="Basic Information Complete" />
            <ChecklistItem checked={validations.hasModule} text="At least one Module exists" />
            <ChecklistItem checked={validations.hasLessons} text="Every Module has at least one Lesson" />
            <ChecklistItem checked={validations.hasQuiz} text="At least one Quiz exists" />
            <ChecklistItem checked={validations.hasQuestions} text="Every Quiz contains at least one Question" />
            <ChecklistItem checked={validations.hasThumbnail} text="Thumbnail uploaded" />
            <ChecklistItem checked={validations.hasOutcomes} text="Learning Outcomes added" />
            <ChecklistItem checked={validations.hasPrereqs} text="Prerequisites added" />
            <ChecklistItem checked={validations.hasDuration} text="Estimated Duration calculated" />
            <ChecklistItem checked={validations.resourcesOptional} text="Resources added" optional />
          </div>
        </div>

        <div className="space-y-8">
          {/* SECTION 2: Validation Summary */}
          <div className={`border rounded-xl p-8 shadow-lg ${isReady ? 'bg-green-900/10 border-green-800' : 'bg-red-900/10 border-red-800'}`}>
            <h4 className="text-lg font-bold text-white mb-6">Validation Summary</h4>
            {isReady ? (
              <div className="flex items-center gap-3 text-green-400 font-semibold p-4 bg-green-900/20 rounded-lg border border-green-800/50">
                <CheckCircle className="w-6 h-6" />
                Ready to Publish
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 text-red-400 font-semibold mb-6">
                  <X className="w-6 h-6" />
                  Publishing Blocked
                </div>
                <ul className="space-y-3">
                  {validationErrors.map((err, i) => (
                    <li key={i} className="flex items-start gap-3 text-red-300 text-sm">
                      <X className="w-4 h-4 mt-0.5 shrink-0 text-red-500" /> {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SECTION 3: Course Summary */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
            <h4 className="text-lg font-bold text-white mb-6">Course Summary</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="text-gray-400">Title: <span className="text-white font-medium block truncate" title={currentCourse?.title}>{currentCourse?.title || currentCourse?.titleKey || 'N/A'}</span></div>
              <div className="text-gray-400">Category: <span className="text-white font-medium block">{currentCourse?.category || 'N/A'}</span></div>
              <div className="text-gray-400">Difficulty: <span className="text-white font-medium block">{currentCourse?.difficulty || 'N/A'}</span></div>
              <div className="text-gray-400">Status: 
                <span className={`block font-bold uppercase ${currentCourse?.status === 'published' ? 'text-green-400' : currentCourse?.status === 'archived' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {currentCourse?.status || 'draft'}
                </span>
              </div>
              <div className="text-gray-400">Modules: <span className="text-white font-medium block">{modules.length}</span></div>
              <div className="text-gray-400">Lessons: <span className="text-white font-medium block">{totalLessons}</span></div>
              <div className="text-gray-400">Resources: <span className="text-white font-medium block">{resources.length}</span></div>
              <div className="text-gray-400">Quizzes: <span className="text-white font-medium block">{totalQuizzes}</span></div>
              <div className="text-gray-400">Questions: <span className="text-white font-medium block">{totalQuestions}</span></div>
              <div className="text-gray-400">Est. Hours: <span className="text-white font-medium block">{Math.floor(totalMins / 60)}h {totalMins % 60}m</span></div>
              <div className="text-gray-400">Cert Eligible: <span className="text-green-400 font-medium block">Yes</span></div>
              <div className="text-gray-400">XP Reward: <span className="text-indigo-400 font-medium block">+{currentCourse?.xpReward || 500}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 & 7: Publish Controls / Footer */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-800">
        <button onClick={() => setActiveStep(6)} disabled={isPublishing} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors border border-gray-700">
          Previous
        </button>
        <div className="flex gap-4">
          {currentCourse?.status === 'published' && (
            <button onClick={() => updateCourseStatus('archived')} disabled={isPublishing} className="px-6 py-2.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-medium rounded-lg transition-colors flex items-center border border-red-800/50">
              <Archive className="w-4 h-4 mr-2" />
              Archive Course
            </button>
          )}
          <button onClick={() => updateCourseStatus('draft')} disabled={isPublishing || currentCourse?.status === 'draft'} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">
            Save as Draft
          </button>
          <button 
            onClick={() => updateCourseStatus('published')} 
            disabled={!isReady || isPublishing || currentCourse?.status === 'published'} 
            className={`px-8 py-2.5 font-bold rounded-lg transition-colors flex items-center shadow-lg ${isReady && currentCourse?.status !== 'published' ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/30' : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}`}
          >
            <Globe className="w-4 h-4 mr-2" />
            {currentCourse?.status === 'published' ? 'Already Published' : isPublishing ? 'Publishing...' : 'Publish Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ checked, text, optional }) {
  return (
    <div className={`flex items-center gap-3 ${checked ? 'text-green-400' : optional ? 'text-gray-400' : 'text-gray-300'}`}>
      {checked ? <CheckCircle className="w-5 h-5 shrink-0" /> : optional ? <CheckCircle className="w-5 h-5 opacity-30 shrink-0" /> : <X className="w-5 h-5 shrink-0 text-red-500" />}
      <span className="text-sm font-medium">{text} {optional && <span className="text-xs text-gray-500 font-normal ml-1">(Optional)</span>}</span>
    </div>
  );
}

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('');
  const [instructor, setInstructor] = useState('');
  const [sort, setSort] = useState('newest');

  // Course Builder State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [currentCourse, setCurrentCourse] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/courses', {
        params: {
          page: pagination.page,
          limit: 0,
          search: debouncedSearch,
          category,
          difficulty,
          status,
          instructor,
          sort
        }
      });
      const payload = res?.data?.courses ? res.data : (res?.courses ? res : (res?.data?.data ? res.data.data : null));
      if (payload && Array.isArray(payload.courses)) {
        setCourses(payload.courses);
        setPagination(payload.pagination || { page: 1, total: 0, pages: 1 });
      } else {
        setCourses([]);
      }
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, difficulty, status, instructor, sort, pagination.page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await api.post(`/admin/courses/${id}/duplicate`);
      toast.success('Course duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate course');
      return;
    }

    try {
      await fetchCourses();
    } catch (error) {
      toast.error('Course duplicated but refresh failed.');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await api.put(`/admin/courses/${id}/publish`);
      toast.success('Course visibility updated');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  const openBuilder = (course = null) => {
    setCurrentCourse(course || { title: '', shortDescription: '', difficulty: 'Beginner', category: 'Engineering', status: 'draft' });
    setActiveStep(1);
    setIsBuilderOpen(true);
  };

  const handleSaveCourse = async () => {
    try {
      if (!currentCourse.title) {
        return toast.error("Course title is required");
      }
      
      let generatedSlug = currentCourse.slug;
      if (!generatedSlug) {
        generatedSlug = currentCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      const payload = {
        title: currentCourse.title,
        category: currentCourse.category || 'Engineering',
        difficulty: currentCourse.difficulty || 'Beginner',
        shortDescription: currentCourse.shortDescription,
        status: currentCourse.status || 'draft',
        slug: generatedSlug
      };

      let finalCourse;
      if (currentCourse._id) {
        const res = await api.put(`/admin/courses/${currentCourse._id}`, payload);
        toast.success("Course updated successfully");
        finalCourse = res?.data?.data || res?.data?.course || res?.data || currentCourse;
      } else {
        const res = await api.post(`/admin/courses`, payload);
        toast.success("Course created successfully");
        finalCourse = res?.data?.data || res?.data?.course || res?.data || payload;
      }
      
      console.log('--- SAVED COURSE DATA ---');
      console.log('ID:', finalCourse._id);
      console.log('Title:', finalCourse.title);
      console.log('Slug:', finalCourse.slug);
      console.log('Category:', finalCourse.category);
      console.log('Difficulty:', finalCourse.difficulty);
      console.log(finalCourse);
      console.log('-------------------------');

      setCurrentCourse(finalCourse);
      fetchCourses();
      setActiveStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save course");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      
      {/* HEADER & TOP TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Enterprise Course Management</h1>
          <p className="text-gray-400 mt-1">Create, edit, and publish platform courses</p>
        </div>
        <button 
          onClick={() => openBuilder()}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Course
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-md border border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
          />
        </div>
        
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-white">
          <option value="">All Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Business">Business</option>
          <option value="Soft Skills">Soft Skills</option>
        </select>

        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-white">
          <option value="">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-white">
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-white">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      {/* COURSE TABLE */}
      <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-900/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-400">Course</th>
                <th className="px-6 py-4 font-medium text-gray-400">Category</th>
                <th className="px-6 py-4 font-medium text-gray-400">Difficulty</th>
                <th className="px-6 py-4 font-medium text-gray-400">Enrollment</th>
                <th className="px-6 py-4 font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">Loading courses...</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">No courses found matching your criteria.</td>
                </tr>
              ) : (
                courses.map(course => {
                  const courseTitle = course.title || course.titleKey || 'Untitled Course';
                  const courseDifficulty = course.difficulty || 'Beginner';
                  const courseStatus = course.status || 'draft';
                  const courseCategory = course.category || 'Uncategorized';
                  
                  return (
                  <tr key={course._id} className="hover:bg-gray-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-700 rounded overflow-hidden mr-3">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-500">
                              <Video className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{courseTitle}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{course.modulesCount || 0} Modules • {course.duration || course.estimatedMinutes || 0} mins</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{courseCategory}</td>
                    <td className="px-6 py-4">
                      <span className={cx(
                        "px-2.5 py-1 text-xs font-medium rounded-full",
                        courseDifficulty === 'Beginner' ? "bg-green-500/10 text-green-400" :
                        courseDifficulty === 'Intermediate' ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-red-500/10 text-red-400"
                      )}>
                        {courseDifficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-300 font-medium">{course.studentsEnrolled || 0} Students</span>
                        <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${course.completionRate || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{course.completionRate || 0}% Completion</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cx(
                        "px-2.5 py-1 text-xs font-medium rounded-full border",
                        courseStatus === 'published' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        courseStatus === 'archived' ? "bg-gray-500/10 text-gray-400 border-gray-500/20" :
                        "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}>
                        {courseStatus.charAt(0).toUpperCase() + courseStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 text-gray-400">
                        <button onClick={() => openBuilder(course)} className="p-1 hover:text-indigo-400 transition-colors" title="Edit">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDuplicate(course._id)} className="p-1 hover:text-white transition-colors" title="Duplicate">
                          <Copy className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleTogglePublish(course._id)} className="p-1 hover:text-green-400 transition-colors" title={course.isPublished ? "Unpublish" : "Publish"}>
                          {course.isPublished ? <Archive className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                        </button>
                        <button onClick={() => handleDelete(course._id)} className="p-1 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COURSE BUILDER MODAL */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Builder Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
              <h2 className="text-xl font-bold text-white flex items-center">
                {currentCourse._id ? 'Edit Course' : 'Create New Course'}
                {currentCourse.status === 'draft' && <span className="ml-3 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-md">Draft</span>}
              </h2>
              <button onClick={() => setIsBuilderOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Builder Layout */}
            <div className="flex flex-1 overflow-hidden">
              
              {/* Left Sidebar Steps */}
              <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-2 overflow-y-auto">
                {[
                  { step: 1, label: 'Basic Info', icon: Edit },
                  { step: 2, label: 'Modules', icon: GripVertical },
                  { step: 3, label: 'Lessons', icon: Video },
                  { step: 4, label: 'Resources', icon: Download },
                  { step: 5, label: 'Quiz', icon: CheckCircle },
                  { step: 6, label: 'Preview', icon: Eye },
                  { step: 7, label: 'Publish', icon: Globe },
                ].map(s => (
                  <button
                    key={s.step}
                    onClick={() => setActiveStep(s.step)}
                    className={cx(
                      "flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                      activeStep === s.step 
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                    )}
                  >
                    <s.icon className="w-4 h-4 mr-3" />
                    Step {s.step}: {s.label}
                  </button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
                {activeStep === 1 && (
                  <div className="space-y-6 max-w-3xl">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Course Title</label>
                        <input type="text" value={currentCourse?.title ?? ''} onChange={(e) => setCurrentCourse({...currentCourse, title: e.target.value})} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Advanced React Architecture" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                        <select value={currentCourse?.category ?? 'Engineering'} onChange={(e) => setCurrentCourse({...currentCourse, category: e.target.value})} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500">
                          <option value="Engineering">Engineering</option>
                          <option value="Design">Design</option>
                          <option value="Business">Business</option>
                          <option value="Soft Skills">Soft Skills</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                        <select value={currentCourse?.difficulty ?? 'Beginner'} onChange={(e) => setCurrentCourse({...currentCourse, difficulty: e.target.value})} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500">
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Short Description</label>
                        <textarea value={currentCourse?.shortDescription ?? ''} onChange={(e) => setCurrentCourse({...currentCourse, shortDescription: e.target.value})} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 h-24" placeholder="A brief summary..." />
                      </div>
                    </div>
                  </div>
                )}
                
                {activeStep === 2 && <ModuleBuilderStep currentCourse={currentCourse} />}

                {activeStep === 3 && <LessonBuilderStep currentCourse={currentCourse} />}

                {activeStep === 4 && <ResourcesBuilderStep currentCourse={currentCourse} />}

                {activeStep === 5 && <QuizBuilderStep currentCourse={currentCourse} />}

                {activeStep === 6 && <CoursePreviewStep currentCourse={currentCourse} setActiveStep={setActiveStep} />}

                {activeStep === 7 && <CoursePublishStep currentCourse={currentCourse} setCurrentCourse={setCurrentCourse} setCourses={setCourses} setActiveStep={setActiveStep} setIsBuilderOpen={setIsBuilderOpen} />}

              </div>
            </div>
            
            {/* Builder Footer */}
            <div className="px-6 py-4 border-t border-gray-800 bg-gray-800/30 flex justify-between">
              <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors" onClick={() => setIsBuilderOpen(false)}>Cancel</button>
              <button onClick={handleSaveCourse} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg transition-colors">
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
