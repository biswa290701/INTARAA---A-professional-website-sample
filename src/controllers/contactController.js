import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

// Initialize Resend client with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// DEMO / PLAN BOOKING FORM
export async function demoForm(req, res) {
  const { name, email, plan } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,        // e.g. "INTARAA <[email protected]>"
      to: process.env.RESEND_TO,            // where YOU receive the email
      replyTo: email,                       // so you can reply directly to the user
      subject: `New Package Booking (${plan}) from ${name}`,
      text: `Name: ${name}
Email: ${email}
Selected Plan: ${plan}
      `,
    });

    if (error) {
      console.error("Resend DEMO error:", error);
      return res.status(500).send("Something went wrong.");
    }

    // Works fine with your existing fetch() (res.ok === true)
    return res.status(200).json({ success: true });

    // If you *still* want to use the redirect version instead, use this:
    // return res.redirect("/thankyou.html");

  } catch (err) {
    console.error("Resend DEMO exception:", err);
    return res.status(500).send("Something went wrong.");
  }
}

// CONTACT FORM
export async function contactForm(req, res) {
  const { name, email, company, role, message } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,        // e.g. "INTARAA <[email protected]>"
      to: process.env.RESEND_TO,            // where YOU receive the email
      replyTo: email,
      subject: `New Contact From ${name}`,
      text: `Name: ${name}
Email: ${email}
Company: ${company || "N/A"}
Role: ${role || "N/A"}

Message:
${message || "(no message provided)"}
      `,
    });

    if (error) {
      console.error("Resend CONTACT error:", error);
      return res.status(500).send("Something went wrong.");
    }

    return res.status(200).json({ success: true });
    // or: return res.redirect("/thankyou.html");

  } catch (err) {
    console.error("Resend CONTACT exception:", err);
    return res.status(500).send("Something went wrong.");
  }
}