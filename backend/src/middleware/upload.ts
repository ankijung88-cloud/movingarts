import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define a minimal interface to avoid Express.Multer namespace issues
interface MulterFile {
    originalname: string;
    filename: string;
    mimetype: string;
    path: string;
}

const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: (error: Error | null, destination: string) => void) => {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req: Request, file: any, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and MP4/MOV videos are allowed.'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max
    }
});
