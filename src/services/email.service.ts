import nodemailer from 'nodemailer';
import 'dotenv/config'
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendMailOptions } from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "oleh.duma.dev@gmail.com",
    pass: "eyqitcnpbrbrgyxv",
  },
} as SMTPTransport.Options);

interface CustomSendMailOptions extends SendMailOptions {
  email: string;
}

interface ActivationSendMailOptions extends CustomSendMailOptions {
  activationToken: string;
}

export function send({ email, subject, html }: CustomSendMailOptions) {
  return transporter.sendMail({
    from: 'Auth API', // sender address
    to: email,
    subject,
    text: '',
    html,
  });
}

function sendActivationEmail({ email, activationToken }: ActivationSendMailOptions) {
  const href = `${process.env.CLIENT_HOST}/activate/${activationToken}`
  const html = `
  <h1>Activate account</h1>
  <a href="${href}">${href}</a>`;

  return send({email, html, subject: 'Activate'})
}

export const emailService = {
  sendActivationEmail, send
}