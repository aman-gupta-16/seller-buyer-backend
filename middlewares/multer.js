import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "seller_buyer_deliverables",
      resource_type: "raw", // Required for zip files
      public_id: file.originalname.split('.')[0], // This will preserve the original filename
      format: file.originalname.split('.').pop(),  // Ensures the extension is preserved
    };
  },
});

export const upload = multer({ storage });
