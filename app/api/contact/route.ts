import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const contactEmail = process.env.CONTACT_TO_EMAIL ?? "Ninglu1088@gmail.com";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, interest, message, smsConsent } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (smsConsent && !phone) {
      return NextResponse.json({ error: "Phone number required for SMS consent" }, { status: 400 });
    }

    const submission = {
      name,
      email,
      phone,
      interest,
      message,
      smsConsent: Boolean(smsConsent),
      smsConsentRecordedAt: smsConsent ? new Date().toISOString() : null,
    };

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL ?? "Luna Art Studio <registration@lunaart.studio>",
        to: contactEmail,
        reply_to: email,
        subject: `${interest === "Digital Art Classes" ? "Digital Art Registration" : "New Website Inquiry"} — ${name}`,
        html: `
          <h2>${escapeHtml(interest === "Digital Art Classes" ? "Digital Art Registration" : "New Website Inquiry")}</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
          <p><strong>Interest:</strong> ${escapeHtml(interest || "Not provided")}</p>
          <p><strong>SMS consent:</strong> ${smsConsent ? "Yes" : "No"}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line">${escapeHtml(message)}</p>
        `,
      });

      if (error) {
        console.error("Contact notification email failed:", error);
        return NextResponse.json({ error: "Unable to send notification" }, { status: 502 });
      }
    } else {
      console.warn("RESEND_API_KEY is not configured; contact submission logged only.");
      console.log("Contact form submission:", submission);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
