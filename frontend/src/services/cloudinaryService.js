/**
 * Cloudinary unsigned upload service for incident images.
 * Uses unsigned uploads for frontend-only image uploads (no backend required).
 * Securely stores image URLs in Firestore.
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

class CloudinaryService {
  /**
   * Upload image to Cloudinary using unsigned upload.
   * @param {File} file - Image file to upload
   * @returns {Promise<string>} - Secure image URL from Cloudinary
   */
  async uploadImage(file) {
    if (!file) {
      throw new Error("No file provided");
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("Cloudinary configuration missing. Check environment variables.");
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.");
    }

    // Validate file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size must be less than 10MB");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Upload failed");
      }

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error("No URL returned from Cloudinary");
      }

      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Upload multiple images sequentially.
   * @param {File[]} files - Array of image files
   * @returns {Promise<string[]>} - Array of secure image URLs
   */
  async uploadImages(files) {
    if (!Array.isArray(files) || files.length === 0) {
      return [];
    }

    const urls = [];
    for (const file of files) {
      try {
        const url = await this.uploadImage(file);
        urls.push(url);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        throw error;
      }
    }

    return urls;
  }
}

export default new CloudinaryService();
