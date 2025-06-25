import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AboutMe from './components/AboutMe';
import MyProjects from './components/MyProjects';
import ContactMe from './components/ContactMe';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('about');
  const [theme, setTheme] = useState('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setIsTransitioning(true);
      
      // Delay the page change to allow exit animation
      setTimeout(() => {
        setCurrentPage(newPage);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const renderPage = () => {
    const pageProps = {
      isTransitioning,
      key: currentPage // Force re-render for animations
    };

    switch (currentPage) {
      case 'about':
        return <AboutMe {...pageProps} />;
      case 'projects':
        return <MyProjects {...pageProps} />;
      case 'contact':
        return <ContactMe {...pageProps} />;
      default:
        return <AboutMe {...pageProps} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={handlePageChange}
        theme={theme}
        setTheme={setTheme}
      />
      <div className={`page-container ${isTransitioning ? 'page-exit' : 'page-enter'}`}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
