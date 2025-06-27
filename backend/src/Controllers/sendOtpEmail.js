import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(toEmail, otp) {
  try {
    await resend.emails.send({
      from: 'TheQuro <support@updates.thequro.com>',
      to: toEmail,
      subject: 'Verify Your Email',
      html: `
    <div style="background-color: #f6f9fc; padding: 40px 0; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
        
        <!-- Logo -->
        <div style="text-align: center; padding: 30px 20px 10px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO3VQJxeBeipiP37Z9c80iPltywjWLnGTljA&s" alt="TheQuro Logo" style="height: 50px;" />
        </div>

        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />

        <!-- Body -->
        <div style="padding: 0 30px 30px; text-align: center;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p style="color: #555; font-size: 16px;">Use the OTP below to verify your email address. This helps us keep your account secure.</p>

          <div style="margin: 30px auto; width: fit-content; background-color: #f0f4f8; padding: 15px 30px; font-size: 28px; font-weight: bold; letter-spacing: 3px; border-radius: 6px; color: #1a1a1a;">
            ${otp}
          </div>

          <p style="color: #999; font-size: 14px;">This OTP is valid for the next 5 minutes.</p>
        </div>

        <!-- Footer -->
        <div style="background: #f1f3f5; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          © ${new Date().getFullYear()} TheQuro. All rights reserved.<br/>
          Need help? Contact us at <a href="mailto:support@thequro.com" style="color: #555;">support@thequro.com</a>
        </div>

      </div>
    </div>
  `,
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send OTP email');
  }
}
