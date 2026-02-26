import { put } from "@vercel/blob";

export async function uploadFileToVercel(path: string, file: File) {
  const { url } = await put(path, file, {
    access: "public",
    token: process.env.GB_BLOB_READ_WRITE_TOKEN,
  });

  return url;
}
