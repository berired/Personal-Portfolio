import React from 'react';
import './ContactMe.css';
import { 
  SiGithub, 
  SiInstagram, 
  SiFacebook 
} from 'react-icons/si';
import { 
  FaPhone, 
  FaEnvelope, 
  FaGraduationCap 
} from 'react-icons/fa';

const ContactMe = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Get In Touch</h1>
        <p>Feel free to reach out to me through any of these channels</p>
      </div>

      <div className="contact-content">
        <div className="contact-section">
          <h2>Social Media</h2>
          <div className="social-links">
            <a 
              href="https://github.com/berired" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link github"
            >
              <SiGithub className="social-icon" />
              <span>GitHub</span>
            </a>
            
            <a 
              href="https://instagram.com/berired_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
            >
              <SiInstagram className="social-icon" />
              <span>Instagram</span>
            </a>
            
            <a 
              href="https://facebook.com/rrredcrayons" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link facebook"
            >
              <SiFacebook className="social-icon" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div className="contact-section">
          <h2>Contact Information</h2>
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-item-header">
                <FaPhone className="contact-icon" />
                <h3>Contact Number</h3>
              </div>
              <p>+63 960 517 1601</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-item-header">
                <FaGraduationCap className="contact-icon" />
                <h3>School Email</h3>
              </div>
              <p>david.wagan@ciit.edu.ph</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-item-header">
                <FaEnvelope className="contact-icon" />
                <h3>Work Email</h3>
              </div>
              <p>xanderwagan28@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMe; 