import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import './MyProjects.css';

const MyProjects = () => {
  const [projects] = useState([
    {
      id: 1,
      name: "Coffee Shop Landing Page",
      description: "A Coffee Shop Landing Page using React",
      techStack: "React, HTML, CSS",
      category: "personal projects",
      imagePath: "/src/assets/project1.jpg"
    },
    {
      id: 2,
      name: "David's Dream Car Garage",
      description: "Web Design Scripting Finals",
      techStack: "HTML, CSS, JavaScript",
      category: "school projects",
      imagePath: "/src/assets/project2.jpg"
    },
    {
      id: 3,
      name: "Midterm Output Product Catalog",
      description: "Multi-page Product Catalog for Web Programming Midterms",
      techStack: "React, JavaScript, CSS, HTML",
      category: "school projects",
      imagePath: "/src/assets/project3.jpg"
    },
    {
      id: 4,
      name: "KamunEats",
      description: "A restaurant locator website for STS Finals Project",
      techStack: "HTML, CSS, JavaScript",
      category: "school projects",
      imagePath: "/src/assets/project4.jpg"
    },
    {
      id: 5,
      name: "Discord Calendar Bot",
      description: "A calendar bot for Discord using Python",
      techStack: "Python",
      category: "personal projects",
      imagePath: "/src/assets/project5.jpg"
    },
    {
      id: 6,
      name: "Hibla ng Kasaysayan",
      description: "A historical website for RPH Finals Project",
      techStack: "HTML, CSS, JavaScript",
      category: "school projects",
      imagePath: "/src/assets/project6.jpg"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>My Projects</h1>
        <p>Explore my work across different categories and technologies</p>
      </div>

      <div className="projects-content">
        <div className="category-tabs">
          <button 
            className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Projects
          </button>
          <button 
            className={`category-tab ${selectedCategory === 'personal projects' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('personal projects')}
          >
            Personal Projects
          </button>
          <button 
            className={`category-tab ${selectedCategory === 'school projects' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('school projects')}
          >
            School Projects
          </button>
        </div>

        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProjects; 