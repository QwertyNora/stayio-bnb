import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email }: { email: string } = await request.json();

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        passwordResetUUID: uuidv4(),
      },
    });
    return NextResponse.json({
      message:
        "A mail with instructions has been sent to the provided email if it exists",
    });
  } catch (error: any) {
    console.log("Error: failed to reset password", error.message);
    return NextResponse.json({
      message:
        "A mail with instructions has been sent to the provided email if it exists",
    });
  }
}
