import { MAIL_ID, MAIL_PASSWORD, MAIL_USERNAME } from "@/utils/variables";
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
export const emailSender = async ({
  to,
  subject,
  html,
  text,
}: EmailOptions) => {
  var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: MAIL_ID,
    to: to,
    subject: subject ? subject : "Email verification",
    html: html,
    text: text,
  };
  await transporter.sendMail(mailOptions);
};
