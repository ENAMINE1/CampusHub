// Accepts one image in the multipart field "poster" (SPEC.md FR-2.5): JPEG, PNG or WebP, at most
// 2 MB, checked by MIME type AND extension, because either one alone is easy to fake.
// The file stays in memory (req.file.buffer) until the storage adapter saves it.
import path from 'node:path';
import multer from 'multer';
import ApiError from '../utils/ApiError.js';

export const POSTER_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowed = POSTER_TYPES[file.mimetype]?.includes(extension);
    if (!allowed) {
      return cb(
        new ApiError(422, 'INVALID_FILE', 'Poster must be a JPEG, PNG or WebP image.'),
      );
    }
    cb(null, true);
  },
});

const uploadPoster = upload.single('poster');

export default uploadPoster;
