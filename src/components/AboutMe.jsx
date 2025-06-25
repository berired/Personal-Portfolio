import React, { useEffect, useState } from 'react';
import './AboutMe.css';
import profilePicture from '../assets/profile-pictor.jpg';
import { 
  SiHtml5, 
  SiCss3, 
  SiJavascript,
  SiReact,
  SiPython,
  SiCplusplus,
  SiNodedotjs,
  SiGithub
} from 'react-icons/si';
import { FaCode, FaBrain, FaDatabase, FaCubes, FaChartLine, FaJava } from 'react-icons/fa';


const AboutMe = ({ isTransitioning }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isTransitioning) {
      setIsVisible(true);
    }
  }, [isTransitioning]);

  const techStack = [
    { name: 'HTML5', icon: SiHtml5 },
    { name: 'CSS', icon: SiCss3 },
    { name: 'JavaScript', icon: SiJavascript },
    { name: 'Node.js', icon: SiNodedotjs },
    { name: 'React', icon: SiReact },
    { name: 'GitHub', icon: SiGithub },
    { name: 'Python', icon: SiPython },
    { name: 'C++', icon: SiCplusplus },
    { name: 'Java', icon: FaJava },
  ];

  const favoriteSubjects = [
    {
      icon: <FaCode />,
      title: 'Web Programming',
      description: 'Building dynamic and responsive web applications using modern frameworks and technologies'
    },
    {
      icon: <FaBrain />,
      title: 'Machine Learning', 
      description: 'Exploring algorithms and models that enable computers to learn and make predictions from data'
    },
    {
      icon: <FaDatabase />,
      title: 'Data Structures and Algorithms',
      description: 'Mastering efficient data organization and problem-solving techniques for optimal performance'
    },
    {
      icon: <FaCubes />,
      title: 'Object Oriented Programming',
      description: 'Designing and implementing scalable software solutions using OOP principles and design patterns'
    },
    {
      icon: <FaChartLine />,
      title: 'Data Science Programming',
      description: 'Analyzing and visualizing complex datasets to extract meaningful insights and patterns'
    }
  ];

  return (
    <div className={`about-container ${isVisible ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-text">
              <h1 className="hero-title animate-slide-up">
                Hello <span className="accent-dot">.</span>
              </h1>
              <h2 className="hero-subtitle animate-slide-up" style={{animationDelay: '0.1s'}}>I'm David</h2>
              <h3 className="hero-role animate-slide-up" style={{animationDelay: '0.2s'}}>Computer Science Student</h3>
              
              <div className="hero-buttons animate-slide-up" style={{animationDelay: '0.3s'}}>
                <button className="btn-primary hover-lift">Got a project?</button>
                <button className="btn-secondary hover-lift">My resume</button>
              </div>
              
              <div className="tech-showcase animate-slide-up stagger-animation" style={{animationDelay: '0.4s'}}>
                {techStack.map((tech, index) => {
                  const IconComponent = tech.icon;
                  return (
                    <div key={index} className="tech-showcase-item float" style={{animationDelay: `${index * 0.5 + 2}s`}}>
                      <IconComponent />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-image-container animate-fade-in float-reverse" style={{animationDelay: '0.5s'}}>
              <div className="hero-image-bg"></div>
              <img src={profilePicture} alt="David Xander M. Wagan" className="hero-image" />
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section">
        <div className="about-content">
          <div className="about-left animate-slide-right" style={{animationDelay: '0.6s'}}>
            <div className="about-description">
              <p>
                Hello! I'm a passionate computer science student dedicated to creating 
                innovative solutions through code. I love exploring new technologies and 
                building projects that make a difference.
              </p>
            </div>
          </div>
          
          <div className="about-right">
            <div className="about-cards stagger-animation">
              <div className="about-card glass hover-lift animate-slide-left" style={{animationDelay: '0.7s'}}>
                <h3 className="card-label">NAME</h3>
                <p className="card-value">David Xander M. Wagan</p>
              </div>
              
              <div className="about-card glass hover-lift animate-slide-left" style={{animationDelay: '0.8s'}}>
                <h3 className="card-label">COLLEGE PROGRAM</h3>
                <p className="card-value">Bachelor of Science in Computer Science</p>
              </div>
              
              <div className="about-card glass hover-lift animate-slide-left" style={{animationDelay: '0.9s'}}>
                <h3 className="card-label">LOCATION</h3>
                <p className="card-value">Philippines</p>
              </div>
              
              <div className="about-card glass hover-lift animate-slide-left" style={{animationDelay: '1s'}}>
                <h3 className="card-label">SCHOOL</h3>
                <p className="card-value">CIIT - College of Arts and Technology</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Subjects Section */}
      <div className="subjects-section">
        <div className="subjects-header animate-slide-up" style={{animationDelay: '1.1s'}}>
          <h2 className="gradient-text">Favorite Subjects</h2>
          <p className="subjects-subtitle animate-fade-in" style={{animationDelay: '1.2s'}}>
            Computer Science areas that I'm most passionate about
          </p>
        </div>
        
        <div className="subjects-grid stagger-animation">
          {favoriteSubjects.map((subject, index) => (
            <div key={index} className="subject-card glass hover-lift animate-scale-up" style={{animationDelay: `${1.3 + index * 0.1}s`}}>
              <div className="subject-icon pulse" style={{animationDelay: `${2.5 + index * 0.5}s`}}>
                {subject.icon}
              </div>
              <h4 className="subject-title">{subject.title}</h4>
              <p className="subject-description">{subject.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutMe;