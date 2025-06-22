import React from 'react';
import './AboutMe.css';
import profilePicture from '../assets/profile-pictor.jpg';
import { 
  SiHtml5, 
  SiCss3, 
  SiJavascript,
  SiReact,
  SiPython,
  SiCplusplus
} from 'react-icons/si';
import { FaCode } from 'react-icons/fa';

const AboutMe = () => {
  const techStack = [
    { name: 'HTML', icon: SiHtml5 },
    { name: 'CSS', icon: SiCss3 },
    { name: 'JavaScript', icon: SiJavascript },
    { name: 'React', icon: SiReact },
    { name: 'Python', icon: SiPython },
    { name: 'Java', icon: FaCode },
    { name: 'C++', icon: SiCplusplus }
  ];

  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-left">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome to My Portfolio</h1>
            <p className="welcome-message">
              Hello! I'm a passionate computer science student dedicated to creating innovative solutions through code. 
              I love exploring new technologies and building projects that make a difference.
            </p>
          </div>
          
          <div className="info-section">
            <div className="info-item">
              <h3>Name</h3>
              <p>David Xander M. Wagan</p>
            </div>
            
            <div className="info-item">
              <h3>College Program</h3>
              <p>Bachelor of Science in Computer Science</p>
            </div>
            
            <div className="info-item">
              <h3>Location</h3>
              <p>Philippines</p>
            </div>
            
            <div className="info-item">
              <h3>School</h3>
              <p>CIIT - College of Arts and Technology</p>
            </div>
          </div>
          
          <div className="tech-stack-section">
            <h3>My Tech Stack</h3>
            <div className="tech-stack-grid">
              {techStack.map((tech, index) => {
                const IconComponent = tech.icon;
                return (
                  <div key={index} className="tech-item">
                    <IconComponent className="tech-icon" />
                    <span className="tech-name">{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="about-right">
          <div className="profile-picture-container">
            <img 
              src={profilePicture} 
              alt="David Xander M. Wagan" 
              className="profile-picture"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe; 