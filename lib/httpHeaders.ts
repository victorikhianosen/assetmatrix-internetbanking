

export function publicHeaders(): HeadersInit {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
    };
}


export function privateHeaders(token: string): HeadersInit {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };
}
