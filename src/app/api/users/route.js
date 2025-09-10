import { NextResponse } from "next/server";
import users from "@/app/data/user.json"; // <-- Correct path

export async function GET() {
  return NextResponse.json(users);
}
