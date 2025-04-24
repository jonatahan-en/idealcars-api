import nodemailer from "nodemailer";

export async function createTransport() {
  const options = {
    host: process.env.EMAIL_SERVICE_HOST,
    port: process.env.EMAIL_SERVEICE_PORT,
    secure: Boolean(process.env.EMAIL_SERVICE_SECURE),
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASSWORD,
    },
  };
  return nodemailer.createTransport(options);
}

export function generatePreviewURL(sendResult){
    return nodemailer.getTestMessageUrl(sendResult)
}