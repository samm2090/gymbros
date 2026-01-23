import { put } from "@vercel/blob";

export async function uploadFileToVercel(path: string, file: File) {
  const { url } = await put(path, file, {
    access: "public",
  });

  return url;
}
