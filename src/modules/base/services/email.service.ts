import ejs from 'ejs';
import nodemailer, { TransportOptions } from 'nodemailer';
import { EmailModel } from '../data/dtos/email.dto';
import { EmailTemplateType } from '@/modules/base/enums/email.template.type';

export async function send(
  to: string,
  type: EmailTemplateType,
  data?: any
): Promise<boolean> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.FROM_EMAIL, // your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // your App Password
    },
  } as TransportOptions);

  try {
    const email = {
      to: to,
      from: process.env.FROM_EMAIL,
    } as EmailModel;

    // Load and render the EJS email template
    const templatePath = `${__dirname}/../templates/email/${type}.ejs`;
    email.html = await ejs.renderFile(templatePath, data ?? {});

    // Set subject based on template type
    switch (type) {
      case EmailTemplateType.forgotPassword:
        email.subject = 'Reset Password';
        break;
      case EmailTemplateType.changePassword:
        email.subject = 'Password Changed';
        break;
      case EmailTemplateType.onBoarding:
        email.subject = 'Welcome to Service Mate!';
        break;
      default:
        email.subject = 'Notification';
    }

    await transporter.sendMail(email);
    return true;
  } catch (e) {
    console.error('Failed to send email:', e);
    return false;
  }
}
