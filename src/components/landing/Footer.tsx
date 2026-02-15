import { Phone, MapPin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bark text-cream">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">
              Anthony Fischetti Landscaping
            </h3>
            <p className="text-cream/80 text-sm leading-relaxed">
              Professional landscaping services for Union, Essex & Morris Counties. <span className="font-numbers">25</span>+ years of experience creating beautiful outdoor spaces that reflect your individual tastes.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-display">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:908-347-1192" className="flex items-center gap-3 text-cream/80 hover:text-sage transition-colors">
                  <Phone className="w-5 h-5 text-sage" />
                  <span className="font-numbers">908-347-1192</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-cream/80">
                <MapPin className="w-5 h-5 text-sage" />
                <span>PO Box 4, Kenilworth, NJ 07033</span>
              </li>
              <li>
                <a href="mailto:anthonyfischettilandscaping@gmail.com" className="flex items-center gap-3 text-cream/80 hover:text-sage transition-colors">
                  <Mail className="w-5 h-5 text-sage" />
                  <span>anthonyfischettilandscaping@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-display">Service Areas</h4>
            <ul className="text-cream/80 text-sm space-y-2">
              <li>Union County</li>
              <li>Essex County</li>
              <li>Morris County</li>
              <li>Surrounding Areas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream/60">
            <p>© {currentYear} Anthony Fischetti Landscaping. All rights reserved.</p>
            <p>Licensed & Insured | Union, Essex & Morris Counties, NJ</p>
          </div>
        </div>
      </div>

      {/* Tracking Pixels Placeholder */}
      {/* 
        META PIXEL: Add your Meta (Facebook) pixel code here
        <script>...</script>
        
        TIKTOK PIXEL: Add your TikTok pixel code here
        <script>...</script>
       */}
    </footer>
  );
};

export default Footer;
