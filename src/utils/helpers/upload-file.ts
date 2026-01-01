import { http } from "../libs/axios";

export async function uploadFile(file: File, folder?: string) {
  const form = new FormData();

  form.append("file", file);
  if (folder) form.append("folder", folder);

  try {
    const { data } = await http.post("/upload", form);

    return data.path;
  } catch (error) {
    console.error(error);

    return null;
  }
}
