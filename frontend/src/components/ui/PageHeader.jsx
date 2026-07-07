
/**
 * PageHeader Component
 * Provides a standardized title/subtitle section for top-level pages.
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  icon: Icon,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full ${className}`}>
      
      <div className="flex items-start gap-4 sm:gap-5">
        {Icon && (
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-900 to-dark-800 text-primary-400 rounded-2xl flex items-center justify-center shrink-0 border border-primary-500/20 shadow-xl shadow-primary-900/10">
            <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        )}
        <div className="pt-1 sm:pt-2">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="w-full md:w-auto mt-2 md:mt-0">
          {action}
        </div>
      )}
      
    </div>
  );
};

export default PageHeader;
