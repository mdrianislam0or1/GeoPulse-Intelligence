import nodemailer from 'nodemailer';
import config from '../config';
import logger from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: config.email.smtp_host,
  port: config.email.smtp_port,
  secure: config.email.smtp_port === 465, // true for 465, false for other ports
  auth: {
    user: config.email.smtp_user,
    pass: config.email.smtp_pass,
  },
});

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationLink = `${config.frontend_url}/verify-email?token=${token}`;

  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: 'Email Verification - Portfolio Platform',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Portfolio Platform!</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for registering! Please click the button below to verify your email address:</p>
              <a href="${verificationLink}" class="button">Verify Email</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #8B5CF6;">${verificationLink}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Portfolio Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetLink = `${config.reset_pass_link}?token=${token}`;

  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: 'Password Reset Request - Portfolio Platform',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #FFF3CD; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #8B5CF6;">${resetLink}</p>
              <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              </div>
              <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Portfolio Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: 'Welcome to Portfolio Platform!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .features { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .feature-item { margin: 15px 0; padding-left: 25px; position: relative; }
            .feature-item:before { content: "✓"; position: absolute; left: 0; color: #10B981; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome, ${name}! 🎉</h1>
            </div>
            <div class="content">
              <p>Congratulations! Your email has been verified and your account is now active.</p>
              <div class="features">
                <h3>What's Next?</h3>
                <div class="feature-item">Create your first blog post</div>
                <div class="feature-item">Start a new project</div>
                <div class="feature-item">Log your learning journey</div>
                <div class="feature-item">Build your professional portfolio</div>
              </div>
              <p>We're excited to have you on board. Let's build something amazing together!</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Portfolio Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
    throw error;
  }
};
