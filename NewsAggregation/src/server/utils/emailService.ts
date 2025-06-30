import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log("sending email through", process.env.SMTP_EMAIL);

    await this.transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      text: body,
    });
  }
}
