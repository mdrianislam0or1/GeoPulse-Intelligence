import { z } from 'zod';

// Register validation
export const registerValidation = z.object({
  body: z
    .object({
      fullName: z
        .string({ required_error: 'Full name is required' })
        .min(2, 'Full name must be at least 2 characters')
        .max(50, 'Full name must not exceed 50 characters')
        .trim(),
      username: z
        .string({ required_error: 'Username is required' })
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must not exceed 30 characters')
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          'Username can only contain letters, numbers, hyphens, and underscores',
        )
        .toLowerCase()
        .trim(),
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
      password: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters')
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Password must contain at least one uppercase letter',
        })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Password must contain at least one lowercase letter',
        })
        .refine((value) => /[0-9]/.test(value), {
          message: 'Password must contain at least one number',
        })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
          message: 'Password must contain at least one special character',
        }),
      confirmPassword: z.string({ required_error: 'Confirm password is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

// Login validation
export const loginValidation = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
  }),
});

// Verify email validation
export const verifyEmailValidation = z.object({
  body: z.object({
    token: z.string({ required_error: 'Verification token is required' }),
  }),
});

// Forgot password validation
export const forgotPasswordValidation = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
  }),
});

// Reset password validation
export const resetPasswordValidation = z.object({
  body: z
    .object({
      token: z.string({ required_error: 'Reset token is required' }),
      newPassword: z
        .string({ required_error: 'New password is required' })
        .min(8, 'Password must be at least 8 characters')
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Password must contain at least one uppercase letter',
        })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Password must contain at least one lowercase letter',
        })
        .refine((value) => /[0-9]/.test(value), {
          message: 'Password must contain at least one number',
        })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
          message: 'Password must contain at least one special character',
        }),
      confirmPassword: z.string({ required_error: 'Confirm password is required' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

// Change password validation
export const changePasswordValidation = z.object({
  body: z
    .object({
      currentPassword: z.string({ required_error: 'Current password is required' }),
      newPassword: z
        .string({ required_error: 'New password is required' })
        .min(8, 'Password must be at least 8 characters')
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Password must contain at least one uppercase letter',
        })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Password must contain at least one lowercase letter',
        })
        .refine((value) => /[0-9]/.test(value), {
          message: 'Password must contain at least one number',
        })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
          message: 'Password must contain at least one special character',
        }),
      confirmPassword: z.string({ required_error: 'Confirm password is required' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

// Refresh token validation
export const refreshTokenValidation = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});

// Verify 2FA validation
export const verifyTwoFactorValidation = z.object({
  body: z.object({
    token: z.string({ required_error: 'Token is required' }).length(6, 'Token must be 6 digits'),
  }),
});
