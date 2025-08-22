import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendEmail({ to, subject, html }) {
  if (!env.SMTP_HOST || !env.SMTP_USER) {
    console.log("📧 [DEV] Email not configured. Would send to:", to, subject);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: `Routing App <${env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
