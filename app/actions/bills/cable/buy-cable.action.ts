
"use server";

import { cookies } from "next/headers";
import { privateHeaders } from "@/lib/httpHeaders";
import { BuyCableRequest } from "@/types/bill.types";

const baseUrl = process.env.BASE_URL;

export async function BuyCable(payload: BuyCableRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return {
            responseCode: "401",
            message: "Unauthenticated",
        };
    }

    try {
        const res = await fetch(`${baseUrl}/api/vas/cable/buy`, {
            method: "POST",
            headers: privateHeaders(token),
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        return await res.json();
    } catch  {
        return {
            responseCode: "500",
            message: "Network error",
        };
    }
}



