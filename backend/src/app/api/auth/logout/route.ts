import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Ta bort tokenen genom att sätta en tom cookie med maxAge 0
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Detta raderar cookien
  });

  return response;
}
