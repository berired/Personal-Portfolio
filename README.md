# Personal Portfolio

A modern, responsive personal portfolio website built with React for a computer science student. Features a sleek, minimalist design with smooth transitions and a professional appearance.

## Features

### 🎯 Pages
- **About Me**: Personal information, tech stack, and welcome message
- **My Projects**: Portfolio of projects with filtering by category
- **Contact Me**: Social media links and contact information

### 🛠️ Technologies Used
- React 19
- React Router DOM
- CSS3 with modern features
- Responsive design
- Component-based architecture

### 🎨 Design Features
- Modern, minimalist design
- Dark theme with custom color palette
- Smooth transitions and hover effects
- Fully responsive layout
- Professional typography with Inter font

## Color Scheme
- Primary: `#212129` (Background)
- Secondary: `#323949` (Cards/Navbar)
- Accent: `#3d3e51` (Hover states)
- Highlight: `#40445a` (Borders)
- Text: `#4c5265` (Gradients)

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation component
│   ├── AboutMe.jsx         # About page component
│   ├── MyProjects.jsx      # Projects page component
│   ├── ProjectCard.jsx     # Reusable project card
│   ├── ContactMe.jsx       # Contact page component
│   └── *.css              # Component styles
├── App.jsx                 # Main app component
├── main.jsx               # App entry point
└── index.css              # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Customization

### Personal Information
Update the following files with your information:

1. **AboutMe.jsx**: Update name, college program, location, school
2. **ContactMe.jsx**: Update social media links, contact numbers, emails
3. **MyProjects.jsx**: Add your own projects to the projects array

### Styling
- All colors are defined in the CSS files using the specified color scheme
- Modify component CSS files to adjust styling
- Global styles are in `src/index.css` and `src/App.css`

### Adding Projects
Add new projects to the `projects` array in `MyProjects.jsx`:

```javascript
{
  id: uniqueId,
  name: "Project Name",
  description: "Project description",
  techStack: "Tech1, Tech2, Tech3",
  category: "personal projects" | "school projects",
  imagePath: "path/to/image.jpg"
}
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Features Implemented

✅ **Component-Based Design**
- Navbar component with active state tracking
- Reusable ProjectCard component
- Modular CSS for each component

✅ **Routing**
- React Router DOM implementation
- Navigation between pages
- Active link highlighting

✅ **State Management**
- useState for projects data
- Category filtering functionality
- Responsive state management

✅ **Props Usage**
- Project data passed to ProjectCard component
- Dynamic rendering based on props

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints for tablet and mobile
- Flexible grid layouts

✅ **Modern Design**
- Smooth transitions and animations
- Hover effects
- Professional color scheme
- Clean typography

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).
