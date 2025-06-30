// src/server/utils/emailService.ts
import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, body: string) {
  console.log("sending email through",process.env.SMTP_EMAIL)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    text: body,
  });
}
