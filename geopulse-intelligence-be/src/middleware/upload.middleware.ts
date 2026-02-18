/**
 * File upload middleware using Multer
 */

import { Request } from 'express';
import httpStatus from 'http-status';
import multer, { FileFilterCallback } from 'multer';
import { ApplicationError } from '../errors/ApplicationError';
import {
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZES
} from '../lib/fileUpload';


// Use memory storage to process files before upload
const storage = multer.memoryStorage();

/**
 * Create file filter for specific file types
 * @param allowedTypes - Array of allowed MIME types
 * @returns Multer file filter function
 */
const createFileFilter = (allowedTypes: string[]) => {
  return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ApplicationError(
          httpStatus.BAD_REQUEST,
          `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        ),
      );
    }
  };
};

/**
 * Image upload middleware
 */
export const uploadImage = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.image,
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.image),
});

/**
 * Document upload middleware
 */
export const uploadDocument = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.document,
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.document),
});

/**
 * Video upload middleware
 */
export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.video,
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.video),
});

/**
 * Audio upload middleware
 */
export const uploadAudio = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.audio,
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.audio),
});

/**
 * Generic file upload middleware (any file type)
 */
export const uploadAny = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.default,
  },
});

/**
 * Multiple images upload middleware
 */
export const uploadMultipleImages = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.image,
    files: 10, // Maximum 10 files
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.image),
});

/**
 * Avatar upload middleware (single image, smaller size limit)
 */
export const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB for avatars
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.image),
});
