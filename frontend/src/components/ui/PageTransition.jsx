
import { motion } from 'framer-motion';

/**
 * PageTransition Component
 * Wraps page contents in a motion.div to provide smooth entry 
 * and exit animations when routing between pages.
 */
const PageTransition = ({ children, className = '' }) => {
  // Define animation variants for the page
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
