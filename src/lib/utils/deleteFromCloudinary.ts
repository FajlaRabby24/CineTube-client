import axios, { AxiosError } from "axios";

interface DeleteImageErrorResponse {
  error: string;
}

export async function deleteFromCloudinary(
  secureUrl: string,
  resourceType: string = "image",
) {
  // Remove everything up to and including "/upload/"
  const uploadIndex = secureUrl.indexOf("/upload/");
  if (uploadIndex === -1) throw new Error("Invalid Cloudinary URL");
  const afterUpload = secureUrl.slice(uploadIndex + "/upload/".length);
  // Remove optional version segment (e.g., "v1234567890/")
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  // Remove file extension
  const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

  try {
    await axios.delete("/api/delete-image", {
      data: { publicId, resourceType },
    });
  } catch (err) {
    const error = err as AxiosError<DeleteImageErrorResponse>;
    error.response?.data?.error ||
      "Something went wrong, in deleteFromCloudinary";
  }
}
