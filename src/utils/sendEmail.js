// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// export async function sendEmail({ to, subject, html }) {
//   if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
//     console.log("📧 [DEV] Email not configured. Would send to:", to, subject);
//     return;
//   }
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false,
//     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//   });
//   await transporter.sendMail({
//     from: `Routing App <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     html,
//   });
// }
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("📧 [DEV] Email not configured. Would send to:", to, subject);
    return;
  }
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: `Routing App <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
