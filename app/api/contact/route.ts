import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, interest, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Option 1: Use Resend (recommended) — add RESEND_API_KEY to your .env.local
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "onboarding@resend.dev",
    //   to: "hello@lunaartsstudio.com",
    //   subject: `New Inquiry from ${name}`,
    //   html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> ${phone}</p><p><b>Interest:</b> ${interest}</p><p><b>Message:</b> ${message}</p>`,
    // });

    // Option 2: Log for now (replace with real email service)
    console.log("Contact form submission:", { name, email, phone, interest, message });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
