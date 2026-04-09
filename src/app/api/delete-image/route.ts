import { v2 as cloudinary } from "cloudinary";
import { NextRequest } from "next/server";
import { envVars } from "../../../config/env";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

interface DeleteImageRequest {
  publicId: string;
  resourceType?: string;
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId, resourceType }: DeleteImageRequest = await request.json();
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.log(`Error from cloudinary file delete - routes ${error}`);
  }
}
