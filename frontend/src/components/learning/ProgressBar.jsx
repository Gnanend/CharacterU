import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-dark-800 rounded-full h-2.5 mt-2">
      <div 
        className="bg-primary-500 h-2.5 rounded-full transition-all duration-500" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
