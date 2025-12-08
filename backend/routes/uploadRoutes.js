import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3Client } from '../config/s3.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get S3 bucket name from environment (lazy evaluation)
const getS3Bucket = () => {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) {
    throw new Error('AWS_S3_BUCKET environment variable is required. Please set it in your .env file.');
  }
  return bucket;
};

// Configure multer for S3 upload (lazy initialization - only when route is called)
const getUploadMiddleware = () => {
  const bucket = getS3Bucket();
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: bucket,
      acl: 'public-read',
      key: function (req, file, cb) {
        // Generate unique filename: timestamp-random-uuid-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `quiz-images/${uniqueSuffix}-${file.originalname}`;
        cb(null, filename);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Only allow image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  });
};

// @desc    Upload image to S3
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, (req, res, next) => {
  try {
    const upload = getUploadMiddleware();
    upload.single('image')(req, res, next);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'S3 bucket configuration error. Please check AWS_S3_BUCKET in .env file.',
    });
  }
}, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the public S3 URL
    const imageUrl = req.file.location;

    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image',
    });
  }
});

export default router;

