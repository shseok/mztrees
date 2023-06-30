import { NextResponse } from "next/server";
import items from "@/trending.json";

export async function GET(request: Request) {
  return NextResponse.json(items);
}
