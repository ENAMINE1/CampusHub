// Creates the email sender. With SMTP settings (for example a free Ethereal test inbox) it sends
// real mail; without them it uses nodemailer's JSON transport, which only builds the message:
// nothing leaves your machine, which is exactly right for development and tests.
import nodemailer from 'nodemailer';
import config from '../config/index.js';

export function createMailer() {
  if (!config.smtp.host) return nodemailer.createTransport({ jsonTransport: true });
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });
}
