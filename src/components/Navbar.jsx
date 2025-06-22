import React from 'react';
import './Navbar.css';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = ({ currentPage, setCurrentPage, theme, setTheme }) => {
  const handleNavClick = (page) => {
    setCurrentPage(page);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="navbar">
      <a 
        href="#"
        className="navbar-brand"
        onClick={(e) => {
          e.preventDefault();
          handleNavClick('about');
        }}
      >
        Portfolio
      </a>
      <ul className="navbar-nav">
        <li className="nav-item">
          <button 
            onClick={() => handleNavClick('about')}
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
          >
            About Me
          </button>
        </li>
        <li className="nav-item">
          <button 
            onClick={() => handleNavClick('projects')}
            className={`nav-link ${currentPage === 'projects' ? 'active' : ''}`}
          >
            My Projects
          </button>
        </li>
        <li className="nav-item">
          <button 
            onClick={() => handleNavClick('contact')}
            className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
          >
            Contact Me
          </button>
        </li>
        <li className="nav-item">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 