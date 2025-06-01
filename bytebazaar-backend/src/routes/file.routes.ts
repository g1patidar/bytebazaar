import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadToDrive, downloadDriveFile, deleteFromDrive } from '../services/drive.service';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload file to Google Drive
router.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToDrive(
      req.file.path,
      req.file.mimetype
    );

    // Delete the temporary file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'File uploaded successfully',
      fileId: result.fileId,
      webViewLink: result.webViewLink
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// Download file from Google Drive
router.get('/download/:fileId', isAuthenticated, async (req, res) => {
  try {
    const { fileId } = req.params;
    const downloadPath = path.join('downloads', `${fileId}`);

    if (!fs.existsSync('downloads')) {
      fs.mkdirSync('downloads', { recursive: true });
    }

    await downloadDriveFile(fileId, downloadPath);
    
    res.download(downloadPath, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
      // Delete the temporary file after download
      fs.unlinkSync(downloadPath);
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
});

// Delete file from Google Drive
router.delete('/:fileId', isAuthenticated, async (req, res) => {
  try {
    const { fileId } = req.params;
    await deleteFromDrive(fileId);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});

export default router; 