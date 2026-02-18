import bcrypt from 'bcryptjs'; // Updated from 'bcrypt'
import config from '../config';

export const hashPassword = async (password: string): Promise<string> => {
  // Ensure saltRounds is a number; bcryptjs requires numeric salt rounds
  const saltRounds = Number(config.bcrypt_salt_rounds) || 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
