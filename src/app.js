import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './Landing';
import IssuesPlatform from './app.jsx';

function App() {
  const glassEffectPrimary = 'bg-white bg-opacity-5 backdrop-blur-md border border-gray-800/30';

  return (
    <Router>
      <div className="min-h-screen relative overflow-x-hidden text-white font-poppins">
        <div className="absolute inset-0 z-0 "></div>

        {/* Fixed Header with Curved Bottom */}
        
        {/* Fixed Header with Rounded Bottom */}
        {/* Fixed Header with Rounded Top and Bottom */}
        <header className={`fixed top-0 left-0 right-0 z-20 ${glassEffectPrimary} py-4 sm:py-5 px-50 sm:px-6 rounded-3xl mx-2 sm:mx-4 mt-2 sm:mt-3`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-4 sm:mb-0">RaizeIt</h1>
          </div>
        </header>

        {/* Main Content with Padding to Avoid Overlap */}
        <div className="max-w-7xl mx-auto relative z-10 pt-24 sm:pt-28 px-4 sm:px-6 pb-6 sm:pb-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<IssuesPlatform />} />
            <Route path="*" element={<h2 className="text-center text-4xl text-white mt-20">404 - Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;