const { PrismaClient } = require('@prisma/client');
const cloudinary = require('../config/cloudinaryConfig');
const prisma = new PrismaClient();
const fs = require('fs');

exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Save the file details to the database (Cloudinary URL, etc.)
    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        path: result.secure_url,  // Store the URL from Cloudinary
        size: req.file.size,
        mimeType: req.file.mimetype,
        uploadedAt: new Date(),
        folderId: req.body.folderId || null,
      },
    });

    res.json({ message: 'File uploaded successfully', file });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      include: {
        folder: true,  // Include folder data in the file query
      },
    });
    
    res.render('files', { files });  // Render the 'files.ejs' view and pass the files data
  } catch (error) {
    res.status(500).json({ error: 'Failed to get files' });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  const { id } = req.params; // Get file ID from URL

  try {
    // Find the file in the database
    const file = await prisma.file.findUnique({
      where: { id: parseInt(id) },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // If the file is stored locally, remove it from the filesystem
    if (file.path && !file.path.startsWith('https://')) {
      fs.unlinkSync(file.path);  // Delete the file from the server
    } else if (file.path && file.path.startsWith('https://')) {
      // If the file is stored in Cloudinary, delete it from Cloudinary
      const publicId = file.path.split('/').pop().split('.')[0]; // Extract public ID
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete the file record from the database
    await prisma.file.delete({
      where: { id: parseInt(id) },
    });

    // Redirect back to the files page
    res.redirect('/files');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};
