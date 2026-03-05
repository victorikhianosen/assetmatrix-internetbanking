import { NextResponse } from "next/server";
import { getCable } from "@/app/actions/bills/cable/get-cable.action";

export async function POST(req: Request) {
  const { cable } = await req.json();
  const data = await getCable(cable);
  return NextResponse.json(data);
}

