import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { UserLoginData } from "@/types/user";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body: UserLoginData = await request.json();
    const { login, password } = body;

    if (!login || !password) {
      return NextResponse.json(
        { error: "Login (username or email) and password are required" },
        { status: 400 }
      );
    }

    const isEmail = login.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail ? { email: login } : { userName: login },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User matching credentials not found" },
        { status: 400 }
      );
    }

    // Kontrollera om lösenordet stämmer (ingen hashning just nu)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "User matching credentials not found" },
        { status: 400 }
      );
    }

    // Returnera användaren (utan token eftersom JWT ännu inte är implementerat)
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error: any) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { error: "An error occurred while logging in" },
      { status: 500 }
    );
  }
}

//TODO: Implement user login

//TODO: validate incoming data

//TODO: find user on email
//!ELSE: return 400 "user matching credentials not found"

//TODO: validate password is matching
//!ELSE: return 400 "user matching credentials not found"

//TODO: return user
