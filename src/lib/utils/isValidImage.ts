import { httpClient } from "../axios/httpClient";

export const isValidImage = async (file: File) => {
  const meta = {
    name: file.name,
    size: file.size,
    type: file.type,
  };

  const res = await httpClient.post("/validate-file", meta);
  console.log(res, "res from isValidImage");
  return res;
};
