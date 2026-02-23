import { useState } from 'react';
import paverWalkwayImg from '@/assets/gallery/paver-walkway.png';
import foundationLandscapingImg from '@/assets/gallery/foundation-landscaping.png';
import paverDrivewayImg from '@/assets/gallery/paver-driveway.png';

// Static project data - local images for top 3, external for bottom 3
const projects = [
  {
    image: paverWalkwayImg,
    title: "Paver Walkway",
    description: "Custom stone walkway with decorative border"
  },
  {
    image: foundationLandscapingImg,
    title: "Foundation Landscaping",
    description: "Beautiful shrub installation with fresh mulch beds"
  },
  {
    image: paverDrivewayImg,
    title: "Paver Driveway",
    description: "Full driveway installation with quality pavers"
  },
  {
    image: "https://i.imgur.com/28JWWqY.jpg",
    title: "Poolside Landscaping",
    description: "Elegant shrub bed installation along pool fence"
  },
  {
    image: "https://i.imgur.com/er8ZGSt.jpg",
    title: "Cobblestone Driveway",
    description: "Classic cobblestone driveway with clean edges"
  },
  {
    image: "https://i.imgur.com/MXxyDYY.jpg",
    title: "Privacy Screening",
    description: "Strategic shrub placement for natural privacy"
  }
];

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        {!imageLoaded && !imageError && (
          <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
            <span className="text-muted-foreground text-sm">Loading...</span>
          </div>
        )}
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">{project.title}</span>
          </div>
        ) : (
          <img 
            src={project.image} 
            alt={`${project.title} - ${project.description} by Anthony Fischetti Landscaping NJ`}
            loading={index < 3 ? "eager" : "lazy"}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6 text-cream">
          <h3 className="text-xl font-display font-bold mb-1">
            {project.title}
          </h3>
          <p className="text-cream/80 text-sm">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const GallerySection = () => {
  return (
    <section id="gallery" aria-label="Project gallery" className="py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-bark mb-4">
            Our Recent Projects
          </h2>
          <p className="text-bark/70 max-w-2xl mx-auto">
            Take a look at some of our completed landscaping and hardscaping projects 
            throughout Union, Essex & Morris Counties.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
