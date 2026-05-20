import React from 'react';
import Card from './Card';
import Button from './Button';

/**
 * EmptyState Component
 * Provides a standardized, friendly UI when lists or datasets are empty.
 */
const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  actionIcon,
  className = ''
}) => {
  return (
    <Card className={`flex flex-col items-center justify-center text-center py-16 px-6 border-dashed border-2 bg-dark-950/50 ${className}`}>
      
      {Icon && (
        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-dark-700">
          <Icon className="w-10 h-10 text-slate-500" />
        </div>
      )}
      
      <h3 className="text-xl font-bold text-white tracking-tight mb-2">{title}</h3>
      
      {description && (
        <p className="text-sm text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button 
          variant="secondary"
          onClick={onAction}
          icon={actionIcon}
        >
          {actionLabel}
        </Button>
      )}
      
    </Card>
  );
};

export default EmptyState;
