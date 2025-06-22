import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AboutMe from './components/AboutMe';
import MyProjects from './components/MyProjects';
import ContactMe from './components/ContactMe';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('about');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutMe />;
      case 'projects':
        return <MyProjects />;
      case 'contact':
        return <ContactMe />;
      default:
        return <AboutMe />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        theme={theme}
        setTheme={setTheme}
      />
      {renderPage()}
    </div>
  );
}

export default App;
