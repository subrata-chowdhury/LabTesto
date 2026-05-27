import { v2 as cloudinary } from "cloudinary";

// Configured securely; this also implicitly permits the Admin API (e.g., .api.usage())
// given that the API Key and Secret are correctly populated from the environment.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
