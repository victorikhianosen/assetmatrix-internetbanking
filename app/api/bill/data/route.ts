import { NextResponse } from "next/server";
import { getDataBundles } from "@/app/actions/bills/data/get-data-bundle.action";

export async function POST(req: Request) {
  const { network } = await req.json();
  const data = await getDataBundles(network);
  return NextResponse.json(data);
}