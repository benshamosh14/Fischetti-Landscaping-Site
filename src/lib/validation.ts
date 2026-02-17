import { z } from "zod";

const sanitizeString = (val: string) =>
  val.trim().replace(/<[^>]*>/g, "").replace(/[<>'"]/g, "");

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters")
    .transform(sanitizeString),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .max(20, "Phone number is too long")
    .regex(/^[\d\s()+-]+$/, "Invalid phone number format"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(255, "Email is too long")
    .email("Invalid email address"),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(300, "Address is too long")
    .transform(sanitizeString),
  service: z
    .string()
    .min(1, "Service is required")
    .max(100, "Service name is too long"),
  other_service: z
    .string()
    .max(200, "Description is too long")
    .transform(sanitizeString)
    .nullable()
    .optional(),
});

export const reviewSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters")
    .transform(sanitizeString),
  rating: z.number().int().min(1, "Rating is required").max(5, "Rating must be 1-5"),
  review_text: z
    .string()
    .trim()
    .min(1, "Review is required")
    .max(2000, "Review must be under 2000 characters")
    .transform(sanitizeString),
  service_type: z
    .string()
    .min(1, "Service type is required")
    .max(100, "Service type is too long"),
});

export type LeadFormData = z.infer<typeof leadSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
