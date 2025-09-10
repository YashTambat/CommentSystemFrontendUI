import { NextResponse } from "next/server";
import comments from "@/app/data/comments.json";

export async function GET() {
  return NextResponse.json(comments);
}