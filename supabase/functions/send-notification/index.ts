import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "lead" | "review";
  data: Record<string, unknown>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();
    const recipientEmail = "anthonyfischettilandscaping@gmail.com";
    
    let subject: string;
    let html: string;

    if (type === "lead") {
      subject = `New Quote Request from ${data.name}`;
      html = `
        <h1>New Quote Request</h1>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Service:</strong> ${data.service}${data.other_service ? ` - ${data.other_service}` : ''}</p>
        <hr />
        <p><em>This lead was submitted via your website.</em></p>
      `;
    } else if (type === "review") {
      subject = `New Review Pending Approval from ${data.name}`;
      html = `
        <h1>New Review Submitted</h1>
        <p><strong>Customer:</strong> ${data.name}</p>
        <p><strong>Service:</strong> ${data.service_type}</p>
        <p><strong>Rating:</strong> ${'⭐'.repeat(data.rating as number)}</p>
        <p><strong>Review:</strong></p>
        <blockquote style="border-left: 3px solid #4a7c59; padding-left: 16px; margin-left: 0;">
          ${data.review_text}
        </blockquote>
        <hr />
        <p><em>This review is pending approval. Log in to your admin panel to approve or reject it.</em></p>
      `;
    } else {
      throw new Error("Invalid notification type");
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
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending notification:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
