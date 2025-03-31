
/**
 * File upload controller
 */
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configure upload directory
const uploadDir = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Upload a file
 */
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { originalname, mimetype, size, filename } = req.file;
    
    // Determine file type
    let fileType = 'file';
    if (mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (mimetype.startsWith('video/')) {
      fileType = 'video';
    }
    
    // Generate public URL
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const fileUrl = `${baseUrl}/uploads/${filename}`;
    
    return res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        id: uuidv4(),
        originalName: originalname,
        filename,
        mimetype,
        size,
        type: fileType,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ error: 'Server error during file upload' });
  }
};

module.exports = {
  uploadFile
};
