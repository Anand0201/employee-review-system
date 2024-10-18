import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
import { convert } from 'html-to-text';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import path from 'path';
configDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Email {
    constructor(user){
        this.to = user.email;
        this.firstName = user.name;
        this.from = `OrionsTechElite <${process.env.EMAIL}>`
    }

    newTransport(){
        return nodemailer.createTransport({
            service: 'gmail',
            port: 405,
            secure: true,
            logger: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    };

    async send(templates, subject){
        const options = {
            wordwrap: 130
        }
            // 1) Render HTML based on a ejs template
        const html = await ejs.renderFile(
          `${__dirname}/../views/email/${templates}.ejs`,
          {
            firstName: this.firstName,
            url: this.url,
            subject,
          },
        );

        const mailoption = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html, options)
        }

        await this.newTransport().sendMail(mailoption)
    }

    async sendWelcome() {
        await this.send('welcome',"Welcome to the OTE-FlowTime")
    }
}

export default Email