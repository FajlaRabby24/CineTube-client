import axios from "axios";
import { envVars } from "../../config/env";

export const uploadToCloudinary = async (
  file: File,
  fileType: string = "image",
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    envVars.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  );
  const url = `https://api.cloudinary.com/v1_1/${envVars.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${fileType}/upload`;
  const res = await axios.post(url, formData);

  const data = res.data;

  console.log({ res }, "fron upload file in cloudinary file");

  if (res.status !== 200 || !data.secure_url) {
    return {
      success: false,
      message: "Cloudinary upload failed",
      data: null,
    };
  }

  return {
    success: true,
    data: data.secure_url,
    message: "Image uploaded successfully",
  };
};
