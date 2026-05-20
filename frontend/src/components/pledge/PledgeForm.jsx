import React, { useState, useRef } from 'react';
import { Loader2, Upload, AlertCircle, CheckCircle2, Video, X } from 'lucide-react';
import pledgeService from '../../services/pledgeService';
import Button from '../ui/Button';

/**
 * PledgeForm component handles the text input and the complex two-step process
 * of uploading a video to Cloudinary, receiving the secure URL, and submitting the final pledge.
 */
const PledgeForm = () => {
  const [formData, setFormData] = useState({
    pledgeText: '',
    language: 'en',
  });
  const [videoFile, setVideoFile] = useState(null);
  
  // Status machine: idle | uploading | submitting | success | error
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef(null);

  const validateForm = () => {
    if (formData.pledgeText.trim().length < 10) {
      setErrorMessage('Pledge text must be at least 10 characters long.');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage(''); // Clear errors when user types
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic frontend validation to match backend rules
      if (!file.type.startsWith('video/')) {
        setErrorMessage('Please select a valid video file.');
        setVideoFile(null);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage('Video must be less than 50MB.');
        setVideoFile(null);
        return;
      }
      setVideoFile(file);
      setErrorMessage('');
    }
  };

  const clearFile = () => {
    setVideoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) return;
    
    try {
      let finalVideoUrl = null;
      
      // Step 1: Upload Video to Cloudinary via backend if one is selected
      if (videoFile) {
        setStatus('uploading');
        const uploadRes = await pledgeService.uploadVideo(videoFile, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        });
        
        finalVideoUrl = uploadRes.videoUrl;
      }

      // Step 2: Submit Pledge data + optional Cloudinary URL
      setStatus('submitting');
      await pledgeService.submitPledge({
        ...formData,
        videoUrl: finalVideoUrl
      });
      
      setStatus('success');
      // Reset form states
      setFormData({ pledgeText: '', language: 'en' });
      setVideoFile(null);
      
    } catch (err) {
      setStatus('error');
      // Display the structured error message returned from the backend or the generic error message
      const apiErrorMessage = err.response?.data?.message || err.message || 'An error occurred while submitting your pledge.';
      setErrorMessage(apiErrorMessage);
    }
  };

  // Success State UI
  if (status === 'success') {
    return (
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 text-center space-y-4 shadow-xl max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Pledge Submitted Successfully!</h2>
        <p className="text-slate-400">Thank you for making your commitment. Your pledge is now pending review.</p>
        <Button 
          variant="secondary"
          onClick={() => setStatus('idle')}
          className="mt-6"
        >
          Submit Another Pledge
        </Button>
      </div>
    );
  }

  const isLoading = status === 'uploading' || status === 'submitting';

  // Main Form UI
  return (
    <div className="w-full max-w-2xl mx-auto bg-dark-900 border border-dark-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Make a Pledge</h2>
          <p className="text-slate-400 text-sm">Commit to your character growth journey. Add an optional video to strengthen your pledge.</p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Pledge Text Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Your Pledge</label>
            <textarea
              name="pledgeText"
              value={formData.pledgeText}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 bg-dark-950 border border-dark-800 focus:ring-primary-500 focus:border-primary-500 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all resize-none"
              placeholder="I pledge to..."
              disabled={isLoading}
            />
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-950 border border-dark-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none"
              disabled={isLoading}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Video Upload Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Video Evidence (Optional)</label>
            
            {!videoFile ? (
              <div 
                className="border-2 border-dashed border-dark-700 hover:border-primary-500/50 bg-dark-950/50 rounded-xl p-8 text-center transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-dark-800 group-hover:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary-400" />
                </div>
                <p className="text-sm font-medium text-white mb-1">Click to upload video</p>
                <p className="text-xs text-slate-500">MP4, MOV, AVI up to 50MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-dark-950 border border-dark-800 rounded-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-primary-900/30 text-primary-400 rounded-lg shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-white truncate">{videoFile.name}</p>
                    <p className="text-xs text-slate-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                {!isLoading && (
                  <button 
                    type="button" 
                    onClick={clearFile}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
              disabled={isLoading}
            />
          </div>

          {/* Upload Progress Bar */}
          {status === 'uploading' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Uploading Video...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-dark-950 rounded-full h-2 overflow-hidden border border-dark-800">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="premium"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-4"
          >
            {status === 'uploading' ? 'Uploading Media...' : 'Submitting Pledge...'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PledgeForm;
