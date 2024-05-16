import {ILogger, IMailer} from "../../../types";
import nodemailer from "nodemailer";
import env from "../../env";

export default
class MailerService implements IMailer {
  protected _transporter: nodemailer.Transporter;
  protected _logger: ILogger;

  constructor({ Logger } : { Logger: ILogger }) {
    this._logger = Logger;

    const options:any = {
      service: env('EMAIL_SERVICE'),
      host: env('EMAIL_HOST'),
      port: env('EMAIL_PORT'),
      secure: env('EMAIL_SECURE') === 'true',
      debug: true,
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3' // треба щоб працювало з Microsoft Exchange
      }
    };
    if (env('EMAIL_AUTH_USER') && env('EMAIL_AUTH_PASS')) {
      options.auth = {
        user: env('EMAIL_AUTH_USER'),
        pass: env('EMAIL_AUTH_PASS')
      };
    }
    this._transporter = nodemailer.createTransport(options);
  }

  async sendNotification(email: string, subject: string, message: string): Promise<void> {
    this._logger.info(`Sending email to ${email} with message: ${message}`);
    await this._transporter.sendMail({
      from: env('EMAIL_SENDER'),
      to: email,
      subject,
      text: message
    });
  }
}
