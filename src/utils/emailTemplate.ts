export const htmlEmailTemplates = {
  verifyEmail: (token: string) =>
    emailTemplate({ token, title: "Verify your email" }),
  forgotPassword: (token: string) =>
    emailTemplate({ token, title: "Forgot your password?" }),
  resetPassword: (token: string) =>
    emailTemplate({ token, title: "Reset your password" }),
  blockEmail: (token: string) =>
    emailTemplate({ token, title: "Your account has been blocked" }),
};

interface EmailTemplate {
  token?: string;
  title?: string;
  name?: string;
}
export const emailTemplate = ({
  token,
  name,
  title = "Verify your email",
}: EmailTemplate) => {
  const url = token ? `http://localhost:8080/api/v1/auth/verify/${token}` : "#";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">

  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333;">Verify Your Email Address</h2>
    <p style="color: #555;">
      Hi ${name},
    </p>
    <p style="color: #555;">
      Thank you for registering with our service. Please verify your email address by clicking the button below. This helps us ensure that we have the correct email address associated with your account.
    </p>
    
    <div style="text-align: center; margin: 20px 0;">
      <a href=${url} style="display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease;">Verify Email</a>
    </div>

    <p style="color: #555;">
      If you did not request this, please ignore this email.
    </p>
    <p style="color: #555;">
      Best regards,<br>
      The QUIZZ BUZZ Team
    </p>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #999;">
      If you're having trouble clicking the "Verify Email" button, copy and paste the following URL into your web browser:<br>
      <a href=${url} style="color: #007BFF; text-decoration: none;">Copy url</a>
    </p>
  </div>

</body>
</html>
`;
};
