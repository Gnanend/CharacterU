
import { Loader2 } from 'lucide-react';

/**
 * Reusable Loading Spinner Component
 * 
 * @param {string} size - size of the spinner (sm, md, lg, xl)
 * @param {string} className - optional extra tailwind classes
 */
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const dimensions = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${dimensions} animate-spin text-primary-500`} />
    </div>
  );
};

export default LoadingSpinner;
