import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import GallerySection from "@/components/landing/GallerySection";
import ReviewsSection from "@/components/landing/ReviewsSection";
import ReviewFormSection from "@/components/landing/ReviewFormSection";
import LeadFormSection from "@/components/landing/LeadFormSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <GallerySection />
      <ReviewsSection />
      <ReviewFormSection />
      <LeadFormSection />
      <Footer />
    </main>
  );
};

export default Index;