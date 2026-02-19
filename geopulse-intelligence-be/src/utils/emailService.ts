import nodemailer from 'nodemailer';
import { User } from '../app/modules/Auth/auth.model';
import config from '../config';
import logger from './logger';

const transporter = nodemailer.createTransport({
  host: config.email.smtp_host,
  port: config.email.smtp_port,
  secure: config.email.smtp_port === 465,
  auth: {
    user: config.email.smtp_user,
    pass: config.email.smtp_pass,
  },
});

/**
 * Send a verification email with a token.
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const mailOptions = {
      from: `"GeoPulse Intelligence" <${config.email.from}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for registering with GeoPulse Intelligence!</p>
          <p>Your email verification token is:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; font-family: monospace; font-size: 18px; word-break: break-all;">
            ${token}
          </div>
          <p>Please enter this token in our application to verify your email address.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
          <p style="color: #888; font-size: 12px;">This token will expire in 24 hours.</p>
        </div>
      `,
      text: `Email Verification\n\nYour verification token is: ${token}\n\nThis token will expire in 24 hours.`,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send verification email to ${email}:`, error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send a watchlist / crisis alert email to a user by userId.
 * Looks up the user's email from the database.
 */
export const sendAlertEmail = async (userId: string, subject: string, body: string) => {
  try {
    const user = await User.findById(userId).select('email name').lean();
    if (!user || !user.email) {
      logger.warn(`[Email] No email found for user ${userId}, skipping email notification`);
      return;
    }

    const mailOptions = {
      from: `"GeoPulse Intelligence" <${config.email.from}>`,
      to: user.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d9534f;">🚨 GeoPulse Alert</h2>
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            ${body.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #888; font-size: 12px;">You are receiving this because of your watchlist preferences.</p>
        </div>
      `,
      text: body,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`[Email] Alert email sent to ${user.email}: ${subject}`);
  } catch (error: any) {
    logger.error(`[Email] Failed to send alert email to user ${userId}:`, error.message);
    // Don't throw — email failures shouldn't break the flow
  }
};

/**
 * Send a crisis notification email.
 */
export const sendCrisisNotification = async (
  email: string,
  crisisTitle: string,
  severity: string,
  description: string,
) => {
  try {
    const mailOptions = {
      from: `"GeoPulse Intelligence" <${config.email.from}>`,
      to: email,
      subject: `🚨 Crisis Alert: ${crisisTitle} [${severity.toUpperCase()}]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d9534f;">Crisis Event Detected</h2>
          <p><strong>Severity:</strong> ${severity.toUpperCase()}</p>
          <p>${description.replace(/\n/g, '<br>')}</p>
          <p style="color: #888; font-size: 12px;">GeoPulse Intelligence — Automated Crisis Detection</p>
        </div>
      `,
      text: `Crisis Alert: ${crisisTitle}\nSeverity: ${severity}\n\n${description}`,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`[Email] Crisis notification sent to ${email}`);
  } catch (error: any) {
    logger.error(`[Email] Failed to send crisis notification:`, error.message);
  }
};
