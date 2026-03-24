const multer  = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Store files directly on Cloudinary — no local disk involved
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder:        "learnhive_resources",
      resource_type: "raw",
      access_mode:   "public",
      public_id:     `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
      format:        undefined
    };
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOC/DOCX files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }  // 10 MB
});

module.exports = upload;