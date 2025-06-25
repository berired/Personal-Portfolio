import React, { useEffect, useState } from 'react';
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

const ContactMe = ({ isTransitioning }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isTransitioning) {
      setIsVisible(true);
    }
  }, [isTransitioning]);

  return (
    <div className={`contact-container ${isVisible ? 'fade-in' : ''}`}>
      <div className="contact-header animate-slide-up">
        <h1 className="gradient-text">Contacts</h1>
        <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>Feel free to reach out to me through any of these channels</p>
      </div>

      <div className="contact-content">
        <div className="contact-section glass hover-lift animate-slide-right" style={{animationDelay: '0.3s'}}>
          <h2>Social Media</h2>
          <div className="social-links stagger-animation">
            <a 
              href="https://github.com/berired" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link github hover-lift"
              style={{animationDelay: '0.4s'}}
            >
              <SiGithub className="social-icon" />
              <span>GitHub</span>
            </a>
            
            <a 
              href="https://instagram.com/berired_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram hover-lift"
              style={{animationDelay: '0.5s'}}
            >
              <SiInstagram className="social-icon" />
              <span>Instagram</span>
            </a>
            
            <a 
              href="https://facebook.com/rrredcrayons" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link facebook hover-lift"
              style={{animationDelay: '0.6s'}}
            >
              <SiFacebook className="social-icon" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div className="contact-section glass hover-lift animate-slide-left" style={{animationDelay: '0.4s'}}>
          <h2>Contact Information</h2>
          <div className="contact-info stagger-animation">
            <div className="contact-item hover-lift" style={{animationDelay: '0.5s'}}>
              <div className="contact-item-header">
                <FaPhone className="contact-icon pulse" />
                <h3>Contact Number</h3>
              </div>
              <p>+63 960 517 1601</p>
            </div>
            
            <div className="contact-item hover-lift" style={{animationDelay: '0.6s'}}>
              <div className="contact-item-header">
                <FaGraduationCap className="contact-icon pulse" />
                <h3>School Email</h3>
              </div>
              <p>david.wagan@ciit.edu.ph</p>
            </div>
            
            <div className="contact-item hover-lift" style={{animationDelay: '0.7s'}}>
              <div className="contact-item-header">
                <FaEnvelope className="contact-icon pulse" />
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