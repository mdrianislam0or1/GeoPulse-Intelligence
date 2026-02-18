import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';
import logger from '../../utils/logger';

interface IImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    size: number;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

/**
 * Upload image to ImgBB
 * @param fileBuffer - Image buffer
 * @param filename - Optional filename
 * @returns ImgBB response
 */
export const uploadToImgBB = async (fileBuffer: Buffer, filename: string = 'image'): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', fileBuffer.toString('base64'));

    // Optional: Add expiration or name params if needed
    // formData.append('name', filename);

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) throw new Error('IMGBB_API_KEY is not configured');

    const response = await axios.post<IImgBBResponse>(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error('ImgBB upload failed');
    }
  } catch (error) {
    logger.error('ImgBB Upload Error:', error);
    throw new Error('Failed to upload image to ImgBB');
  }
};

/**
 * Optimize image before upload or storage
 * Resizes to max 1200px width and converts to WebP for compression
 */
export const optimizeImage = async (buffer: Buffer): Promise<Buffer> => {
  return await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
};

/**
 * Convert buffer to Base64 string for Mongo storage (fallback)
 */
export const toBase64 = (buffer: Buffer): string => {
  return `data:image/webp;base64,${buffer.toString('base64')}`;
};

export const imgbbService = {
  uploadToImgBB,
  optimizeImage,
  toBase64,
};
