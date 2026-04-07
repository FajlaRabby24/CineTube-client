import { httpClient } from "../axios/httpClient";

export const validateImage = async (file: File) => {
  const meta = {
    name: file.name,
    size: file.size,
    type: file.type,
  };

  const res = await httpClient.post("/validate-file", meta);
  console.log(res, "res from isValidImage");
  if (!res.success) {
    return {
      success: false,
      message: "File is not valid",
    };
  }
  console.log(res, "fron validate image ");
};
