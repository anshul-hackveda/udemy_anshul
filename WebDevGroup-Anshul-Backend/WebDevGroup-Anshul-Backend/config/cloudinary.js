// backend/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function
const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      return null;
    }

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Remove local file after upload
    fs.unlinkSync(filePath);

    return uploadResult.secure_url;
  } catch (error) {
    // Still remove local file even if error occurs
    fs.unlinkSync(filePath);
    console.log("Cloudinary Upload Error:", error);
    return null;
  }
};

export default uploadOnCloudinary;
