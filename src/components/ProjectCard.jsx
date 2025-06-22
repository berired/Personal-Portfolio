import React from 'react';
import './ProjectCard.css';
import { 
  SiHtml5, 
  SiCss3, 
  SiJavascript,
  SiReact,
  SiPython,
  SiCplusplus,
  SiGithub
} from 'react-icons/si';
import { FaDatabase, FaTools, FaCode } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  // Tech stack icons mapping with proper React Icons
  const techIcons = {
    'HTML': SiHtml5,
    'CSS': SiCss3,
    'CSS3': SiCss3,
    'JavaScript': SiJavascript,
    'JS': SiJavascript,
    'React': SiReact,
    'Java': FaCode,
    'Python': SiPython,
    'C++': SiCplusplus,
    'API': FaDatabase
  };

  const getTechIcon = (tech) => {
    const IconComponent = techIcons[tech] || FaTools;
    return <IconComponent />;
  };

  return (
    <div className="project-card">
      <div className="project-image-container">
        <div className="project-image-placeholder">
          <span>{project.name}</span>
        </div>
      </div>
      
      <div className="project-content">
        <div className="project-header">
          <h3 className="project-name">{project.name}</h3>
          <span className={`project-category ${project.category.replace(' ', '-')}`}>
            {project.category}
          </span>
        </div>
        
        <p className="project-description">{project.description}</p>
        
        <div className="project-tech-stack">
          <h4>Tech Stack:</h4>
          <div className="tech-tags">
            {project.techStack.split(', ').map((tech, index) => (
              <span key={index} className="tech-tag">
                <span className="tech-tag-icon">{getTechIcon(tech)}</span>
                <span className="tech-tag-text">{tech}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 