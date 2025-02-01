import { createTransport } from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    sendOTP(email, otp, link) {
        const html = `
        <body style="background-color: #f4f4f4; color: #333; font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <div style="background-color: #2c3e50; color: #fff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0;">Flying OTP - Account Verification</h1>
            </div>

            <div style="margin: 20px 0; font-size: 18px; font-weight: bold;">
                <p>Please verify your account using the following OTP:</p>
                <h2 style="color: #e74c3c;">${otp}</h2>
            </div>

            <div style="margin: 20px 0; font-size: 16px; font-style: italic;">
                <p>Alternatively, you can activate your account by clicking the link below:</p>
                <a href="${link}" style="color: #3498db; font-weight: bold; text-decoration: none;">Activate Account</a>
            </div>

            <div style="margin-top: 20px; font-size: 14px; color: #7f8c8d;">
                <p>If you did not request this verification, please disregard this email.</p>
            </div>
        </body>`;

        const mailOptions = {
            from: 'Flying OTP <noreply@flyingotp.go>',
            to: email,
            subject: 'Flying OTP - Account Verification',
            html
        };

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
            } else {
                console.log('Email sent: ', info.response);
            }
        });
    }
}

const mailService = new MailService();
export default mailService;
