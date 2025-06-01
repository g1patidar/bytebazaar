import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
const router = express.Router();

import { isAuthenticated } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';
import {
    getAllProjects,
    getProjectsByCategory,
    getProjectById,
    getUserProjects,
    getTrendingProjects,
    createProject,
    uploadFileToDrive,
    updateProject,
    deleteProject
} from '../controllers/project.controller';
import { uploadToDrive, deleteFromDrive } from '../services/drive.service';

// Add multer types
declare global {
    namespace Express {
        interface Request {
            file?: Multer.File
        }
    }
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/', getAllProjects);
router.get('/category/:categoryName', getProjectsByCategory);
router.get('/trending', getTrendingProjects);
router.get('/:id', getProjectById);

// Protected routes
router.get('/user/:userId', isAuthenticated, getUserProjects);

router.post('/upload-project-file', isAuthenticated, upload.single('file'), uploadFileToDrive);

router.post('/upload-thumbnail',upload.single('thumbnail'), uploadFileToDrive )

router.post('/', isAuthenticated, createProject);

router.put('/:id', isAuthenticated, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.file) {
            // Delete old file if exists
            if (req.body.oldFileId) {
                await deleteFromDrive(req.body.oldFileId);
            }
            
            const result = await uploadToDrive(req.file.path, req.file.mimetype);
            req.body.fileUrl = result.webViewLink;
            req.body.fileId = result.fileId;
            fs.unlinkSync(req.file.path);
        }
        next();
    } catch (error: any) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error updating file', error: error.message });
    }
}, updateProject);

router.delete('/:id', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // if (req.body.fileId) {
        //     await deleteFromDrive(req.body.fileId);
        // }
        next();
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting file', error: error.message });
    }
}, deleteProject);

export default router;
