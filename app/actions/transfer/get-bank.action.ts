"use server";

import { cookies } from "next/headers";
import { privateHeaders } from "@/lib/httpHeaders";

const baseUrl = process.env.BASE_URL;

export async function getBanks() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {

        return {
            success: 'error',
            responseCode: '401',
            message: "Unauthenticated",
        };
    }
    try {
        const res = await fetch(
            `${baseUrl}/api/transactions/bank/get-banks`,
            {
                method: "GET",
                headers: privateHeaders(token),
                cache: "no-store",
            }

        );
        const data = await res.json();
        return data;
    } catch {
        return {
            success: 'error',
            message: "Something went wrong",
        };
    }
}



