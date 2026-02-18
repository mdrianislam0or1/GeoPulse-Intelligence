/**
 * File upload utility functions
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import httpStatus from 'http-status';
import path from 'path';
import { ApplicationError } from '../errors/ApplicationError';
import logger from '../utils/logger';

export interface IUploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

/**
 * Allowed file types for different upload categories
 */
export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
};

/**
 * Maximum file sizes (in bytes)
 */
export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 10 * 1024 * 1024, // 10MB
  default: 5 * 1024 * 1024, // 5MB
};

/**
 * Generate unique filename
 * @param originalName - Original filename
 * @returns Unique filename with timestamp and random hash
 */
export const generateUniqueFilename = (originalName: string): string => {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const randomHash = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${randomHash}${ext}`;
};

/**
 * Validate file type
 * @param mimetype - File MIME type
 * @param allowedTypes - Array of allowed MIME types
 * @throws ApplicationError if file type is not allowed
 */
export const validateFileType = (mimetype: string, allowedTypes: string[]): void => {
  if (!allowedTypes.includes(mimetype)) {
    throw new ApplicationError(
      httpStatus.BAD_REQUEST,
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    );
  }
};

/**
 * Validate file size
 * @param size - File size in bytes
 * @param maxSize - Maximum allowed size in bytes
 * @throws ApplicationError if file size exceeds limit
 */
export const validateFileSize = (size: number, maxSize: number): void => {
  if (size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    throw new ApplicationError(
      httpStatus.BAD_REQUEST,
      `File size exceeds limit. Maximum allowed: ${maxSizeMB}MB`,
    );
  }
};

/**
 * Validate uploaded file
 * @param file - Uploaded file object
 * @param category - File category (image, document, video, audio)
 * @throws ApplicationError if validation fails
 */
export const validateUploadedFile = (
  file: IUploadedFile,
  category: keyof typeof ALLOWED_FILE_TYPES,
): void => {
  const allowedTypes = ALLOWED_FILE_TYPES[category];
  const maxSize = MAX_FILE_SIZES[category] || MAX_FILE_SIZES.default;

  validateFileType(file.mimetype, allowedTypes);
  validateFileSize(file.size, maxSize);

  logger.info('✅ File validation passed', {
    filename: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
  });
};

/**
 * Delete file from filesystem
 * @param filePath - Path to file
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
    logger.info('🗑️  File deleted', { path: filePath });
  } catch (error) {
    logger.error('Failed to delete file:', error);
    // Don't throw error, file might already be deleted
  }
};

/**
 * Ensure upload directory exists
 * @param dirPath - Directory path
 */
export const ensureUploadDir = async (dirPath: string): Promise<void> => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    logger.error('Failed to create upload directory:', error);
    throw new ApplicationError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create upload directory',
    );
  }
};

/**
 * Get file extension from filename
 * @param filename - Filename
 * @returns File extension (without dot)
 */
export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase().substring(1);
};

/**
 * Format file size to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
