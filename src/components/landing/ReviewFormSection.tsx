import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { reviewSchema } from "@/lib/validation";

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
  "Other",
];

const ReviewFormSection = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    service_type: "",
    review_text: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (value: string) => {
    setFormData({ ...formData, service_type: value });
  };

  const getFieldError = (fieldName: string) => {
    if (!showErrors) return false;
    if (fieldName === "rating") return rating === 0;
    const value = formData[fieldName as keyof typeof formData];
    return !value || !value.trim();
  };

  const isFormValid = () => {
    const { name, service_type, review_text } = formData;
    return (
      name.trim() &&
      service_type &&
      review_text.trim() &&
      rating > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);

    const parsed = reviewSchema.safeParse({
      name: formData.name,
      rating,
      review_text: formData.review_text,
      service_type: formData.service_type,
    });

    if (!parsed.success) {
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      });
      return;
    }

    const reviewData = parsed.data as { name: string; rating: number; review_text: string; service_type: string };
    const { error } = await supabase.from("reviews").insert(reviewData);

    if (error) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Send email notification (fire and forget - don't block on this)
    supabase.functions.invoke("send-notification", {
      body: { type: "review", data: reviewData }
    }).catch(console.error);

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback. Your review is pending approval.",
    });
  };

  if (isSubmitted) {
    return (
      <section id="leave-review" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Thank You for Your Review!
            </h2>
            <p className="text-muted-foreground text-lg">
              Your feedback means the world to us. Your review will be visible
              once approved.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="leave-review" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Leave a Review
            </h2>
            <p className="text-muted-foreground text-lg">
              We'd love to hear about your experience working with us.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-lg p-8 shadow-xl"
          >
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="review-name" className="text-foreground">
                  Your Name
                </Label>
                <Input
                  id="review-name"
                  name="name"
                  type="text"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-background ${
                    getFieldError("name") ? "border-2 border-red-500" : ""
                  }`}
                />
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="review-service" className="text-foreground">
                  Service Received
                </Label>
                <Select
                  value={formData.service_type}
                  onValueChange={handleServiceChange}
                >
                  <SelectTrigger
                    className={`bg-background ${
                      getFieldError("service_type")
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  >
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

              {/* Rating */}
              <div className="space-y-2">
                <Label className="text-foreground">Rating</Label>
                <div
                  className={`flex gap-1 ${
                    getFieldError("rating") ? "p-2 border-2 border-red-500 rounded" : ""
                  }`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <Label htmlFor="review-text" className="text-foreground">
                  Your Review
                </Label>
                <Textarea
                  id="review-text"
                  name="review_text"
                  placeholder="Tell us about your experience..."
                  value={formData.review_text}
                  onChange={handleChange}
                  rows={4}
                  className={`bg-background ${
                    getFieldError("review_text")
                      ? "border-2 border-red-500"
                      : ""
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-8 bg-primary hover:bg-forest-light text-primary-foreground py-6 text-lg font-semibold"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReviewFormSection;
