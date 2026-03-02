
"use server";

import { cookies } from "next/headers";
import { privateHeaders } from "@/lib/httpHeaders";
import { BankTransfer } from "@/types/transaction.types";

const baseUrl = process.env.BASE_URL;


export async function bankTransfer(payload: BankTransfer) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return {
            responseCode: "401",
            message: "Unauthenticated",
        };
    }

    try {
        const res = await fetch(`${baseUrl}/api/transactions/bank/transfer`, {
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



