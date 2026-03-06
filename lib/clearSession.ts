import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function clearSession() {

    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("user");
    cookieStore.delete("session");

    redirect("/login");
}
