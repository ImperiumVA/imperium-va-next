import * as dotenv from 'dotenv'
import * as nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'

dotenv.config()

class EmailService {
    Transport;
    FromEmail;

    constructor() {
        this.Transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
            port: process.env.EMAIL_PORT || 2525,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD
            }
        });

        this.FromEmail = process.env.EMAIL_FROM;
        this.sendEmail = this.sendEmail.bind(this);
        this.sendTemplateEmail = this.sendTemplateEmail.bind(this);
        this.renderTemplate = this.renderTemplate.bind(this);
    }

    async renderTemplate(templateName, data) {
        const filePath = path.join(__dirname, `../../../../../views/emails/${templateName}.ejs`);
        console.log(`EmailService::renderTemplate-${templateName}`, filePath);
        console.log('EmailService::renderTemplate-data', data);

        const html = await ejs.renderFile(filePath, data);

        return html;    
    }

    async sendTemplateEmail(template, {to, subject, data}) {
        const html = await this.renderTemplate(template, data);

        const message = {
            from: this.FromEmail,
            to: to,
            subject: subject,
            html,
        };

        const sentEmail = await this.Transport.sendMail(message);
        sentEmail.sentAt = new Date();
        sentEmail.subject = subject;
        sentEmail.body = html;
        
        console.log('EmailService::sentEmail', sentEmail);

        return sentEmail;
    }

    async sendEmail(to, subject, msg) {
        const message = {
            from: this.FromEmail,
            to,
            subject,
            msg
        };

        return await this.Transport.sendMail(message);
    }
}

export default new EmailService();