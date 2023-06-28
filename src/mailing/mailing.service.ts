import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailingService {
    async sendEmail(to: string, subject: string, message: string) {
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
              user: process.env.INTERVIEW_APP_SENDER_MAIL_ADDRESS,
              pass: process.env.INTERVIEW_APP_SENDER_MAIL_PASSWORD,
            },
        })
        const mailOptions = {
          //I know we can use no-reply, but with an unofficial domain name + no-reply
          //High chance that the email will lead to spam box
          from: process.env.INTERVIEW_APP_SENDER_MAIL_ADDRESS,
          to,
          subject,
          text: message,
        };
    
        try {
            await transporter.sendMail(mailOptions);
        } catch(e) {
            console.log(e);
            
        }
    }
}
