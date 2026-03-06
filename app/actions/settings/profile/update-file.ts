"use server";

import { cookies } from "next/headers";

const baseUrl = process.env.BASE_URL;

export async function UploadFile(
  imageFile: File,
  type: "passport" | "signature"
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return {
      responseCode: "401",
      message: "Unauthenticated",
    };
  }

  try {
    const formData = new FormData();
    formData.append("image_file", imageFile);
    formData.append("type", type);

    const res = await fetch(`${baseUrl}/api/customers/upload-file`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
      cache: "no-store",
    });

    return await res.json();
  } catch (error){
    console.log(error)
    return {
      responseCode: "500",
      message: "Network error",
    };
  }
}