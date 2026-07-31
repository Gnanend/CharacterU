import React from 'react';

const QuizProgress = ({ current, total, percentage }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-400 font-medium">Question {current} of {total}</span>
        <span className="text-sm text-primary-400 font-bold">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 w-full bg-dark-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;
