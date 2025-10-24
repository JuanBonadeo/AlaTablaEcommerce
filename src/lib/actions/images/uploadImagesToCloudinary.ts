import {v2 as cloudinary} from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' );



export const uploadImages = async( images: string[] ) => {

  try {
  
    const uploadPromises = images.map( async( base64Image ) => {
  
    try {
      return cloudinary.uploader.upload(`data:image/png;base64,${ base64Image }`, { folder: 'alatabla' })
      .then( r => r.secure_url );
      
    } catch (error) {
      console.log(error);
      return null;
    }
    })
  
    const uploadedImages = await Promise.all( uploadPromises );
    return uploadedImages;
  
  
  } catch (error) {
  
    console.log(error);
    return null;
    
  }
  
  
  }
