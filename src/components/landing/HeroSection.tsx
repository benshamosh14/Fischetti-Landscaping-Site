import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const HeroSection = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById("lead-form");
    formSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-bark/85 via-bark/70 to-bark/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          {/* Company Name */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-cream leading-tight">
            Anthony Fischetti Landscaping
          </h1>

          {/* Tagline */}
          <div className="text-lg md:text-xl text-cream/90 max-w-2xl mx-auto font-sans space-y-1">
            <p>Professional Landscaping in Clark, NJ</p>
            <p>—</p>
            <p>Serving Union, Essex & Morris Counties for Over <span className="font-numbers">25</span> Years</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              onClick={scrollToForm}
              className="bg-primary hover:bg-forest-light text-primary-foreground px-8 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all min-w-[220px] h-[58px] flex items-center justify-center"
            >
              Get a Free Quote
            </Button>
            <a 
              href="tel:908-347-1192" 
              className="flex items-center justify-center gap-3 bg-cream/10 backdrop-blur-sm border border-cream/30 rounded-lg px-8 py-4 hover:bg-cream/20 transition-all shadow-lg min-w-[220px] h-[58px] animate-pulse hover:animate-none"
            >
              <Phone className="w-5 h-5 text-cream" />
              <span className="font-numbers font-bold text-xl text-cream tracking-wider leading-none">908-347-1192</span>
            </a>
          </div>

          {/* Trust Badge */}
          <div className="pt-8 flex flex-wrap justify-center gap-6 text-cream/80 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sage rounded-full" />
              <span><span className="font-numbers">25</span>+ Years Experience</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sage rounded-full" />
              Licensed & Insured in Union, Essex & Morris Counties
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sage rounded-full" />
              Free Estimates
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cream/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cream/50 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;