import React, { useState } from 'react';
import './Navbar.css';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ currentPage, setCurrentPage, theme, setTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        David Xander
      </a>
      
      <ul className={`navbar-nav ${isMobileMenuOpen ? 'navbar-nav-mobile-open' : ''}`}>
        <li className="nav-item">
          <button 
            onClick={() => handleNavClick('about')}
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
          >
            Home
          </button>
        </li>
        <li className="nav-item">
          <button 
            onClick={() => handleNavClick('projects')}
            className={`nav-link ${currentPage === 'projects' ? 'active' : ''}`}
          >
            Projects
          </button>
        </li>
        <li className="nav-item">
          <button 
            onClick={() => handleNavClick('contact')}
            className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
          >
            Contacts
          </button>
        </li>
      </ul>
      
      <div className="navbar-mobile" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? (
          <FaTimes className="mobile-menu-icon" />
        ) : (
          <FaBars className="mobile-menu-icon" />
        )}
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}
    </nav>
  );
};

export default Navbar;