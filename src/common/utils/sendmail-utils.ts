import nodemailer from 'nodemailer';
import { emailAddress, emailPassword } from '../../config/mail.config';

export function sendEmail(recieverEmail, content) {
    return new Promise<any>((resolve, reject) => {
        const { subject, text, html } = content;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailAddress,
                pass: emailPassword
            }
        });

        const mailOptions = {
            from: emailAddress,
            to: recieverEmail,
            subject,
            text,
            html
        }
        transporter.sendMail(mailOptions, (err, res) => {
            if (err) return reject(err);
            return resolve(res)
        })
    })
}