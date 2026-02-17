import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
const NOTIFY_PHONE = "908-347-1192";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter (per function instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}, 60_000);

interface NotificationRequest {
  type: "lead" | "review";
  data: Record<string, unknown>;
}

function sanitize(val: unknown, maxLen = 500): string {
  if (typeof val !== "string") return "";
  return val.slice(0, maxLen).replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();
}

function validateLead(data: Record<string, unknown>): string | null {
  const name = sanitize(data.name, 100);
  const phone = sanitize(data.phone, 20);
  const email = sanitize(data.email, 255);
  const address = sanitize(data.address, 300);
  const service = sanitize(data.service, 100);

  if (!name || !phone || !email || !address || !service) {
    return "Missing required fields";
  }
  if (!/^[\d\s()+-]+$/.test(phone)) return "Invalid phone format";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
  return null;
}

function validateReview(data: Record<string, unknown>): string | null {
  const name = sanitize(data.name, 100);
  const rating = Number(data.rating);
  const reviewText = sanitize(data.review_text, 2000);
  const serviceType = sanitize(data.service_type, 100);

  if (!name || !reviewText || !serviceType) return "Missing required fields";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return "Invalid rating";
  return null;
}

async function sendSms(message: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error("Twilio credentials not configured, skipping SMS");
    return;
  }

  const toNumber = "+1" + NOTIFY_PHONE.replace(/\D/g, "");
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  const body = new URLSearchParams({
    To: toNumber,
    From: TWILIO_PHONE_NUMBER,
    Body: message.slice(0, 1600), // Twilio SMS max
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const result = await response.json();
  if (!response.ok) {
    console.error("Twilio SMS failed:", JSON.stringify(result));
  } else {
    console.log("SMS sent successfully:", result.sid);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    // Limit request body size
    const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
    if (contentLength > 10_000) {
      return new Response(
        JSON.stringify({ error: "Request too large" }),
        { status: 413, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { type, data }: NotificationRequest = await req.json();

    if (type !== "lead" && type !== "review") {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const recipientEmail = "anthonyfischettilandscaping@gmail.com";
    let subject: string;
    let html: string;

    if (type === "lead") {
      const validationError = validateLead(data);
      if (validationError) {
        return new Response(
          JSON.stringify({ error: "Invalid request" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const name = sanitize(data.name, 100);
      const phone = sanitize(data.phone, 20);
      const email = sanitize(data.email, 255);
      const address = sanitize(data.address, 300);
      const service = sanitize(data.service, 100);
      const otherService = sanitize(data.other_service, 200);

      subject = `New Quote Request from ${name}`;
      html = `
        <h1>New Quote Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Service:</strong> ${service}${otherService ? ` - ${otherService}` : ''}</p>
        <hr />
        <p><em>This lead was submitted via your website.</em></p>
      `;

      // Send SMS for new leads
      const smsMessage = `New Quote Request!\nName: ${name}\nPhone: ${phone}\nService: ${service}${otherService ? ` - ${otherService}` : ''}\nAddress: ${address}`;
      sendSms(smsMessage).catch(console.error);

    } else {
      const validationError = validateReview(data);
      if (validationError) {
        return new Response(
          JSON.stringify({ error: "Invalid request" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const name = sanitize(data.name, 100);
      const rating = Number(data.rating);
      const reviewText = sanitize(data.review_text, 2000);
      const serviceType = sanitize(data.service_type, 100);

      subject = `New Review Pending Approval from ${name}`;
      html = `
        <h1>New Review Submitted</h1>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Service:</strong> ${serviceType}</p>
        <p><strong>Rating:</strong> ${'⭐'.repeat(rating)}</p>
        <p><strong>Review:</strong></p>
        <blockquote style="border-left: 3px solid #4a7c59; padding-left: 16px; margin-left: 0;">
          ${reviewText}
        </blockquote>
        <hr />
        <p><em>This review is pending approval. Log in to your admin panel to approve or reject it.</em></p>
      `;
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Anthony Fischetti Landscaping <onboarding@resend.dev>",
        to: [recipientEmail],
        subject,
        html,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Email send failed:", JSON.stringify(emailData));
      throw new Error("Failed to send notification");
    }

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error sending notification:", error instanceof Error ? error.message : "Unknown error");
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
