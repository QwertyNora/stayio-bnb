import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { UserLoginData } from "@/types/user";
import { comparePassword } from "@/utils/bcrypt";
import { signJWT } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body: UserLoginData = await request.json();
    const { emailOrUserName, password } = body;

    if (!emailOrUserName || !password) {
      return NextResponse.json(
        { error: "Login (username or email) and password are required" },
        { status: 400 }
      );
    }

    const isEmail = emailOrUserName.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: emailOrUserName }
        : { userName: emailOrUserName },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User matching credentials not found" },
        { status: 400 }
      );
    }

    const passwordIsSame = await comparePassword(body.password, user.password);
    if (!passwordIsSame) {
      return NextResponse.json({ error: "Password mismatch" }, { status: 400 });
    }

    const token = await signJWT({
      userId: user.id,
    });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error: any) {
    console.log("Error: failed to login", error.message);
    return NextResponse.json(
      { message: "user matching credentials not found" },
      { status: 400 }
    );
  }
}
