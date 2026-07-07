
/**
 * Reusable Card Component
 * Provides a standardized container for SaaS interfaces.
 */
const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6 md:p-8',
  hover = false,
  glass = false,
}) => {
  
  const baseClasses = 'border rounded-2xl md:rounded-3xl shadow-sm overflow-hidden';
  const bgClasses = glass 
    ? 'bg-dark-900/60 backdrop-blur-md border-dark-800' 
    : 'bg-dark-900 border-dark-800';
    
  const hoverClasses = hover 
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-dark-700' 
    : '';

  return (
    <div className={`${baseClasses} ${bgClasses} ${hoverClasses} ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
