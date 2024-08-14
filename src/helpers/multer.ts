import multer, { StorageEngine } from 'multer';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

// Define the storage engine for Multer
const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ): void => {
    const img_dir: string = 'uploads';
    if (!fs.existsSync(img_dir)) {
      fs.mkdirSync(img_dir, { recursive: true });
    }
    if (file.mimetype.startsWith('image/')) {
      cb(null, img_dir);
    } else {
      const error: Error = new Error('Only image files are allowed!');
      cb(error, ''); // Provide a destination if an error occurs
    }
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ): void => {
    const extension: string = file.originalname.split('.').pop() || '';
    const fileName: string = `${Date.now()}.${extension}`;
    (req as any).fileName = fileName; // TypeScript will not recognize this by default, so you'll need to extend the Request interface
    cb(null, fileName);
  },
});

// Extend Express Request interface to include fileName property
declare global {
  namespace Express {
    interface Request {
      fileName?: string;
    }
  }
}

// Multer configuration
const upload: multer.Multer = multer({
  storage: storage,
  limits: {
    // fileSize: 2 * 1024 * 1024, // Uncomment if you want to enforce file size limits via Multer
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ): void => {
    const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];
    const fileExt: string = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      const error: any = new Error(
        `Only ${allowedExtensions.join(', ')} files are allowed.`,
      );
      error.status = 400;
      error.code = 'FILE_FORMAT_NOT_MATCH';
      return cb(error);
    }

    cb(null, true);
  },
});

// Middleware to check profile file size before uploading
const checkProfileSize = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const limit: number = 2 * 1024 * 1024;
  const contentLength: number = parseInt(
    req.headers['content-length'] || '0',
    10,
  );

  if (!req.headers['content-length'] || contentLength > limit) {
    const error: any = new Error(
      `Profile file size exceeds 2MB limit or no file provided`,
    );
    error.status = 400;
    return next(error);
  }
  next();
};

export { upload, checkProfileSize };
