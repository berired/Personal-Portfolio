import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import './MyProjects.css';

const MyProjects = ({ isTransitioning }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [projects] = useState([
    {
      id: 1,
      name: "Coffee Shop Landing Page",
      description: "A Coffee Shop Landing Page using React",
      techStack: "React, HTML, CSS",
      category: "personal projects",
      imagePath: "/src/assets/project1.jpg",
      link: "on github"
    },
    {
      id: 2,
      name: "David's Dream Car Garage",
      description: "Web Design Scripting Finals",
      techStack: "HTML, CSS, JavaScript",
      category: "school projects",
      imagePath: "/src/assets/project2.jpg",
      link: "missing repo"
    },
    {
      id: 3,
      name: "Midterm Output Product Catalog",
      description: "Multi-page Product Catalog for Web Programming Midterms",
      techStack: "React, JavaScript, CSS, HTML",
      category: "school projects",
      imagePath: "/src/assets/project3.jpg",
      link: "on github"
    },
    {
      id: 4,
      name: "KamunEats",
      description: "A restaurant locator website for STS Finals Project",
      techStack: "HTML, CSS, JavaScript",
      category: "school projects",
      imagePath: "/src/assets/project4.jpg",
      link: "on github"
    },
    {
      id: 5,
      name: "Discord Calendar Bot",
      description: "A calendar bot for Discord using Python",
      techStack: "Python",
      category: "personal projects",
      imagePath: "/src/assets/project5.jpg",
      link: "on github"
    },
    {
      id: 6,
      name: "Hibla ng Kasaysayan",
      description: "A historical website for RPH Finals Project",
      techStack: "HTML, CSS, JavaScript",
      category: "school projects",
      imagePath: "/src/assets/project6.jpg",
      link: "on github"
    },
    {
      id: 7,
      name: "CatModoro",
      description: "A Pomodoro timerapp dedicated to my girlfriend with a cat theme. With customizable timer, calendar & to-dos, heatmap, fully customizable website theme, and spotify player integration.",
      techStack: "React, JavaScript, CSS, Firebase",
      category: "personal projects",
      imagePath: "/src/assets/project7.jpg",
      link: "#https://catmodoro.vercel.app/"
    },
    {
      id: 8,
      name: "Tahanan ng mga Kwento",
      description: "A children's book repository website for our Panitikan Finals Project",
      techStack: "React, JavaScript, CSS",
      category: "school projects",
      imagePath: "/src/assets/project8.jpg",
      link: "#https://tahananngmgakwento.vercel.app/"
    },
    {
      id: 9,
      name: "AdTalk Event Solution Inc. Landing Page",
      description: "A landing page for a freelance client using React",
      techStack: "React, JavaScript, CSS",
      category: "freelance works",
      imagePath: "/src/assets/project9.jpg",
      link: "#https://adtalk.com.ph/"
    },
    {
      id: 10,
      name: "Glam Innovative Advertising Corp. Landing Page",
      description: "A landing page for a freelance client using React",
      techStack: "React, JavaScript, CSS",
      category: "freelance works",
      imagePath: "/src/assets/project10.jpg",
      link: "#https://glam-landing.vercel.app/"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!isTransitioning) {
      setIsVisible(true);
    }
  }, [isTransitioning]);

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className={`projects-container ${isVisible ? 'fade-in' : ''}`}>
      <div className="projects-header animate-slide-up">
        <h1 className="gradient-text">Projects</h1>
        <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>A showcase of my work across different categories and technologies</p>
      </div>

      <div className="projects-content">
        <div className="category-tabs animate-slide-up stagger-animation" style={{animationDelay: '0.3s'}}>
          <button 
            className={`category-tab hover-lift ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Projects
          </button>
          <button 
            className={`category-tab hover-lift ${selectedCategory === 'personal projects' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('personal projects')}
          >
            Personal Projects
          </button>
          <button 
            className={`category-tab hover-lift ${selectedCategory === 'school projects' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('school projects')}
          >
            School Projects
          </button>
          <button 
            className={`category-tab hover-lift ${selectedCategory === 'freelance works' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('freelance works')}
          >
            Freelance Works
          </button>
        </div>

        <div className="projects-grid stagger-animation">
          {filteredProjects.map((project, index) => (
            <div key={project.id} className="animate-scale-up" style={{animationDelay: `${0.5 + index * 0.1}s`}}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;