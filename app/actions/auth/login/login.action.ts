"use server";

import { cookies } from "next/headers";
import { publicHeaders } from "@/lib/httpHeaders";
import {LoginRequest} from "@/types/auth.types"

const baseUrl = process.env.BASE_URL;


export async function serverLogin(payload: LoginRequest) {
    const res = await fetch(`${baseUrl}/api/customers/login`, {
        method: "POST",
        headers: publicHeaders(),
        body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result?.status === "success") {
        const token = result.data.access_token;
        const expiresAt = new Date(result.data.expired_at);

        const cookieStore = await cookies();

        cookieStore.set("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: expiresAt,
            path: "/",
        });
    }

    return result;
}