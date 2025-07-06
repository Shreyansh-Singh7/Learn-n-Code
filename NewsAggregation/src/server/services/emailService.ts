import nodemailer, { Transporter } from 'nodemailer';
import { IArticle } from '../../utils/interfaces';

export class EmailService {
    private transporter: Transporter;
    private from: string;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        this.from = process.env.EMAIL_FROM || 'newsaggregator43@gmail.com';
    }

    public async sendArticleNotificationEmail(to: string, article: IArticle): Promise<void> {
        const subject = `New Article Matching Your Interests: ${article.title}`;

        const html = `
      <h2>${article.title}</h2>
      <p><strong>Description:</strong> ${article.description}</p>
      <p><strong>Source:</strong> ${article.source}</p>
      <p><strong>Published At:</strong> ${article.published_at}</p>
      <p>
        <a href="${article.url}" target="_blank">Read Full Article</a>
      </p>
      <br>
      <p>Thank you for using News Aggregation App!</p>
    `;

        const mailOptions = {
            from: this.from,
            to,
            subject,
            html
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to} for article "${article.title}"`);
        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
            throw error;
        }
    }
}
