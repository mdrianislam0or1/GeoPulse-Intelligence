// import nodemailer from 'nodemailer';
// import config from '../config';
// import logger from './logger';

// const transporter = nodemailer.createTransport({
//   service: config.email.service,
//   auth: {
//     user: config.email.user,
//     pass: config.email.pass,
//   },
// });

// export const sendVerificationEmail = async (email: string, token: string) => {
//   try {
//     const mailOptions = {
//       from: `"CPMS" <${config.email.from}>`,
//       to: email,
//       subject: 'Verify Your Email Address',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">Email Verification</h2>
//           <p>Thank you for registering with us!</p>
//           <p>Your email verification token is:</p>

//           <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; font-family: monospace; font-size: 18px; word-break: break-all;">
//             ${token}
//           </div>

//           <p>Please enter this token in our application to verify your email address.</p>
//           <p>If you didn't create an account with us, please ignore this email.</p>
//           <p style="color: #888; font-size: 12px;">This token will expire in 24 hours.</p>
//         </div>
//       `,
//       // Plain text version for email clients that don't support HTML
//       text: `
//         Email Verification

//         Thank you for registering with us!

//         Your email verification token is:
//         ${token}

//         Please enter this token in our application to verify your email address.

//         If you didn't create an account with us, please ignore this email.

//         Note: This token will expire in 24 hours.
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     logger.info(`Verification email sent to ${email}`);
//   } catch (error) {
//     logger.error(`Failed to send verification email to ${email}:`, error);
//     throw new Error('Failed to send verification email');
//   }
// };
