import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// TEMP: Hard-coded email (later from Unity)
const TEMP_EMAIL = "biswaonyt@gmail.com";

// In-memory OTP store
// Structure:
// {
//   email: {
//     otp: "123456",
//     expiresAt: 1700000000000
//   }
// }
const otpStore = {};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtp = async (req, res) => {
  try {
    // Later: const { email } = req.body;
    const email = TEMP_EMAIL;

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store / overwrite OTP
    otpStore[email] = {
      otp,
      expiresAt,
    };

    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [email],
      subject: "Your INTARAA Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>INTARAA Verification</h2>
          <p>Your one-time password (OTP) is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      expiresInSeconds: 300,
      otp, // ⚠️ REMOVE in production
    });
  } catch (error) {
    console.error("OTP Send Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};