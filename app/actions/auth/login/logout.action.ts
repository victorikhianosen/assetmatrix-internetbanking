"use server";

import { cookies } from "next/headers";
import { privateHeaders } from "@/lib/httpHeaders";

const baseUrl = process.env.BASE_URL;

export async function serverLogout() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    let message = "Logout out successfully!";

    try {
        if (token) {
            const res = await fetch(`${baseUrl}/api/customers/logout`, {
                method: "POST",
                headers: privateHeaders(token),
                cache: "no-store",
            });
            const json = await res.json();
            cookieStore.delete("access_token");
            message = json?.message ?? message;
        }
    } catch  {
    }

    cookieStore.set("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
    });

    return {
        status: "success",
        message,
    };
}


// "use server";

// import { cookies } from "next/headers";

// export async function logoutAction() {
//   const cookieStore = await cookies();
//   // remove auth cookie
//   cookieStore.delete("access_token");

//   return {
//     status: 'success',
//     responseCode: '000',
//     message: 'Logout successfully. See you next time.'
//   };
// }

