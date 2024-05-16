import nodemailer from 'nodemailer';
import MailerService from "./MailerService";

jest.mock('nodemailer', () => ({
  createTransport: jest.fn()
}));

describe('MailerService', () => {
  let service: MailerService;
  let sendMail = jest.fn();
  const Logger:any = console;
  beforeEach(() => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail });
    service = new MailerService({ Logger });
  });
  test('sendNotification', async () => {
    await service.sendNotification('test@mail.com', "test", 'test2')
    expect(sendMail).toHaveBeenCalledWith({
      "from": "No reply <test@no-mail.com>",
      "subject": "test",
      "text": "test2",
      "to": "test@mail.com",
    });
  });
});
