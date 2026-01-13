import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import ApiError from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
  localFilePath,
  folder = "uploads",
  resourceType = "auto"
) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder,
    });

    await fs.unlink(localFilePath);
    return response;
  } catch (error) {
    try {
      await fs.unlink(localFilePath);
    } catch (_) {}

    throw new ApiError(500, "Cloudinary upload failed");
  }
};

export default uploadOnCloudinary ;
