import React from 'react';

const VideoPlayer = ({ videoUrl }) => {
  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-dark-900 flex items-center justify-center rounded-xl border border-dark-800">
        <span className="text-slate-500">Video not available</span>
      </div>
    );
  }

  // Placeholder for an actual video player (e.g. video.js, plyr, or standard <video>)
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-dark-800 relative shadow-2xl">
      {/* Assuming YouTube embed or raw mp4 for simplicity */}
      {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
        <iframe
          src={videoUrl.replace('watch?v=', 'embed/')}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video 
          controls 
          className="w-full h-full object-cover"
          src={videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
