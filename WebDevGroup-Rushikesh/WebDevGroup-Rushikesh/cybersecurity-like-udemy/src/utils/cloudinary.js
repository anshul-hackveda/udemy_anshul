import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload to Cloudinary
export const uploadOnCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // handles image/video both
      folder: "lectures",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};
