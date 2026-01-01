import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const uploadImages = async (images: string[]) => {
  try {
    const uploadPromises = images.map(async (imageStr) => {
      try {
        // Accept both full data URIs and raw base64 strings
        const isDataUri = imageStr.startsWith('data:');
        const fileParam = isDataUri ? imageStr : `data:image/jpeg;base64,${imageStr}`;

        return cloudinary.uploader
          .upload(fileParam, { folder: 'alatabla' })
          .then((r) => r.secure_url);
      } catch (error) {
        console.log('Cloudinary upload error:', error);
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.log('Cloudinary upload batch error:', error);
    return null;
  }
};
