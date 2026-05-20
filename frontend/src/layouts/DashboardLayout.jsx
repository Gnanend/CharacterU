import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageTransition from '../components/ui/PageTransition';

/**
 * DashboardLayout Component
 * Provides the overarching UI skeleton for authenticated areas of the application.
 * Comprises a sticky sidebar, sticky topbar, and a scrollable main content area.
 */
const DashboardLayout = () => {
  // State to manage mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    // Outer container takes full viewport height and prevents scrolling
    <div className="flex h-screen bg-dark-950 overflow-hidden text-slate-300 font-sans selection:bg-primary-500/30 selection:text-white">
      
      {/* Desktop Sidebar (Always visible on md screens and up) */}
      <div className="hidden md:block h-full shrink-0">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar Overlay (Clicking outside closes it) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar Slide-in */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden transition-transform duration-300 ease-in-out`}>
         <Sidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar spans the remaining width */}
        <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable Page Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 scroll-smooth flex flex-col">
          {/* Breadcrumbs Navigation */}
          <div className="mb-6 hidden sm:block">
            <Breadcrumbs />
          </div>
          
          {/* Animated Route Transitions */}
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname} className="flex-1 flex flex-col">
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
