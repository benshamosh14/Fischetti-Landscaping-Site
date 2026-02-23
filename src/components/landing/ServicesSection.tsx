import { 
  Leaf, 
  Hammer, 
  Fence, 
  TreeDeciduous, 
  Droplets, 
  Lightbulb, 
  SprayCan,
  Waves
} from "lucide-react";

const services = [
  {
    icon: Leaf,
    title: "Landscape Design & Installation",
    description: "Custom designs tailored to your individual tastes, creating a showplace you can be proud of."
  },
  {
    icon: Hammer,
    title: "Hardscapes & Masonry",
    description: "Expert patios, walkways, driveways, and masonry work with precision craftsmanship."
  },
  {
    icon: Fence,
    title: "Fencing & Decks",
    description: "Quality fencing and deck installations to enhance your outdoor living space."
  },
  {
    icon: TreeDeciduous,
    title: "Tree Removal & Pruning",
    description: "Professional tree services to keep your property safe and beautiful."
  },
  {
    icon: Droplets,
    title: "Irrigation Systems",
    description: "Efficient irrigation solutions to keep your landscape thriving year-round."
  },
  {
    icon: Lightbulb,
    title: "Outdoor Lighting",
    description: "Illuminate your landscape with beautiful, functional outdoor lighting designs."
  },
  {
    icon: SprayCan,
    title: "Power Washing",
    description: "Restore the beauty of your surfaces with professional power washing services."
  },
  {
    icon: Waves,
    title: "Water Features",
    description: "Add tranquility to your property with custom fountains and water features."
  }
];

const ServicesSection = () => {
  return (
    <section id="services" aria-label="Landscaping services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg">
            From custom landscape design to complete outdoor transformations, we bring <span className="font-numbers">25</span> years 
            of experience to projects of all sizes. We specialize in never creating two landscapes alike.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-card rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2 font-display">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            We handle virtually all projects, big or small. 
            <span className="text-primary font-semibold"> Let us show you what experience and quality can mean for your home.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;