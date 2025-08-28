import express from 'express';
import multer from 'multer';
import fs from 'fs';
import Course from '../models/courseModel.js'; // Adjust path as needed

const router = express.Router();

// ✅ Set max file size: 500MB
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

// ✅ Configure disk storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// ✅ Allowed file types
const allowedMimeTypes = [
  'video/mp4',
  'video/mpeg',
  'video/avi',
  'image/jpeg',
  'image/png',
  'image/gif'
];

// ✅ Create multer upload instance
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only video and image files are allowed.'));
    }
    cb(null, true);
  }
});

// ✅ Route: Upload any single file (thumbnail/video/etc)
router.post('/', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const message = err instanceof multer.MulterError
        ? `Upload error: ${err.message}`
        : err.message;
      return res.status(400).json({ message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    return res.status(200).json({ url: `/uploads/${req.file.filename}` });
  });
});

// ✅ Route: Edit a lecture (title, isPreviewFree, or video)
router.post('/editlecture/:id', (req, res) => {
  upload.single('videoUrl')(req, res, async (err) => {
    if (err) {
      const message = err instanceof multer.MulterError
        ? `Upload error: ${err.message}`
        : err.message;
      return res.status(400).json({ message });
    }

    try {
      const lectureId = req.params.id;
      const { lectureTitle, isPreviewFree } = req.body;

      // ✅ Find course containing the lecture
      const course = await Course.findOne({ 'lectures._id': lectureId });
      if (!course) {
        return res.status(404).json({ message: 'Lecture not found in any course' });
      }

      const lectureIndex = course.lectures.findIndex(
        l => l._id.toString() === lectureId
      );

      if (lectureIndex === -1) {
        return res.status(404).json({ message: 'Lecture not found inside course' });
      }

      // ✅ Update lecture fields
      const lecture = course.lectures[lectureIndex];

      if (lectureTitle) lecture.lectureTitle = lectureTitle;
      if (typeof isPreviewFree !== 'undefined') {
        lecture.isPreviewFree = isPreviewFree === 'true' || isPreviewFree === true;
      }
      if (req.file) {
        lecture.videoUrl = `/uploads/${req.file.filename}`;
      }

      //  Save and respond
      await course.save();

      res.status(200).json({
        message: 'Lecture updated successfully',
        lecture
      });

    } catch (error) {
      console.error('Error updating lecture:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
});

export default router;


