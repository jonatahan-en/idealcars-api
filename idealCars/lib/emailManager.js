import nodemailer from "nodemailer";

export async function createTransport() {
  const options = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "vickie.kirlin49@ethereal.email",
      pass: "6KbQ3KbdKSb9J9yJsh",
    },
  };
  return nodemailer.createTransport(options);
}

export function generatePreviewURL(sendResult){
    return nodemailer.getTestMessageUrl(sendResult)
}