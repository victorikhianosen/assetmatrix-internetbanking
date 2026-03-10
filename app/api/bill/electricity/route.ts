import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Electricity API working",
  });
}