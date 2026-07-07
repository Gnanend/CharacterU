
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * MainLayout component provides the primary shell of the application,
 * including a global responsive header navigation, main content area,
 * and a sticky footer.
 */
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky top navigation */}
      <Navbar />
      
      {/* Dynamic page content wrapped in a main section */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      
      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default MainLayout;
