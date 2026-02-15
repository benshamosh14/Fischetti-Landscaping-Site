import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const serviceOptions = [
  "Landscape Design & Installation",
  "Hardscapes (Patios, Walkways, Driveways)",
  "Fencing & Decks",
  "Concrete & Masonry",
  "Tree Removal & Pruning",
  "Irrigation Systems",
  "Outdoor Lighting",
  "Power Washing",
  "Water Features",
  "Other"
];

const LeadFormSection = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [otherServiceText, setOtherServiceText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (value: string) => {
    setFormData({ ...formData, service: value });
  };

  const handleOtherServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherServiceText(e.target.value);
  };

  const getFieldError = (fieldName: string) => {
    if (!showErrors) return false;
    if (fieldName === "otherService") {
      return formData.service === "Other" && !otherServiceText.trim();
    }
    const value = formData[fieldName as keyof typeof formData];
    return !value || !value.trim();
  };

  const isFormValid = () => {
    const { name, phone, email, address, service } = formData;
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim() || !service) {
      return false;
    }
    if (service === "Other" && !otherServiceText.trim()) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    
    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);
    
    const leadData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      service: formData.service,
      other_service: formData.service === "Other" ? otherServiceText.trim() : null
    };

    const { error } = await supabase.from("leads").insert(leadData);

    if (error) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Send email notification (fire and forget - don't block on this)
    supabase.functions.invoke("send-notification", {
      body: { type: "lead", data: leadData }
    }).catch(console.error);

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Quote Request Received!",
      description: "We'll contact you within 24 hours to discuss your project.",
    });
  };

  if (isSubmitted) {
    return (
      <section id="lead-form" className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="w-20 h-20 text-primary-foreground mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Thank You!
            </h2>
            <p className="text-primary-foreground/90 text-lg">
              We've received your request and will contact you within <span className="font-numbers">24</span> hours 
              to discuss your landscaping project.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-form" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Get Your Free Quote Today
            </h2>
            <p className="text-primary-foreground/90 text-lg">
              Tell us about your project and we'll provide a free, no-obligation estimate.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-lg p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-background ${getFieldError("name") ? "border-2 border-red-500" : ""}`}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(908) 555-1234"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`bg-background ${getFieldError("phone") ? "border-2 border-red-500" : ""}`}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-background ${getFieldError("email") ? "border-2 border-red-500" : ""}`}
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-foreground">Property Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Main St, Clark, NJ"
                  value={formData.address}
                  onChange={handleChange}
                  className={`bg-background ${getFieldError("address") ? "border-2 border-red-500" : ""}`}
                />
              </div>

              {/* Service Needed */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="service" className="text-foreground">Service Needed</Label>
                <Select value={formData.service} onValueChange={handleServiceChange}>
                  <SelectTrigger className={`bg-background ${getFieldError("service") ? "border-2 border-red-500" : ""}`}>
                    <SelectValue placeholder="Select a service..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {serviceOptions.map((service, index) => (
                      <SelectItem key={index} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Other Service Text Input - Only visible when "Other" is selected */}
              {formData.service === "Other" && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="otherService" className="text-foreground">Please describe the service you need</Label>
                  <Input
                    id="otherService"
                    name="otherService"
                    type="text"
                    placeholder="Describe your landscaping needs..."
                    value={otherServiceText}
                    onChange={handleOtherServiceChange}
                    className={`bg-background ${getFieldError("otherService") ? "border-2 border-red-500" : ""}`}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-8 bg-primary hover:bg-forest-light text-primary-foreground py-6 text-lg font-semibold"
            >
              {isSubmitting ? "Submitting..." : "Request Free Estimate"}
            </Button>

            <p className="text-center text-muted-foreground text-sm mt-4">
              We respect your privacy. Your information will never be shared.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadFormSection;