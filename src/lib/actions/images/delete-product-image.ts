'use server';

import {v2 as cloudinary} from 'cloudinary';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/db/client';

cloudinary.config( process.env.CLOUDINARY_URL ?? '' );


export const deleteProductImage = async( imageId: string, imageUrl: string, slug: string ) => {

  if ( !imageUrl.startsWith('http') ) {
    return {
      ok: false,
      error: 'No se pueden borrar imagenes de FS'
    }
  }
  // Extraer public_id para Cloudinary
  // La URL típica de Cloudinary contiene '/upload/' seguido de un posible 'v<version>/' y luego la ruta (folder/filename.ext)
  let publicId = '';
  try {
    const uploadIndex = imageUrl.indexOf('/upload/');
    if (uploadIndex !== -1) {
      let publicPath = imageUrl.substring(uploadIndex + '/upload/'.length);
      // remover prefijo de versión: v123456/
      publicPath = publicPath.replace(/^v\d+\//, '');
      // quitar extensión
      publicId = publicPath.replace(/\.[^/.]+$/, '');
    } else {
      // fallback al último segmento sin extensión (no incluye folder)
      publicId = imageUrl.split('/').pop()?.replace(/\.[^/.]+$/, '') ?? '';
    }
  } catch (err) {
    console.log('Error extrayendo publicId de Cloudinary:', err);
    publicId = imageUrl.split('/').pop()?.replace(/\.[^/.]+$/, '') ?? '';
  }

  try {
    // Borrar de Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Borrar registro en la base de datos
    await prisma.productImage.delete({ where: { id: imageId } });

    // Revalidar rutas relevantes
    revalidatePath(`/admin/products`)
    revalidatePath(`/admin/products/${slug}`)
    revalidatePath(`/products/${slug}`)

    return { ok: true };

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo eliminar la imagen'
    }
  }

}
