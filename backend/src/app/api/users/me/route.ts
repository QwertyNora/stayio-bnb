import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("userId");
    if (!userId) {
      throw new Error("Failed to get userId from headers");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        bookings: true, // Inkludera användarens bokningar
      },
    });

    const safeUser = {
      ...user,
      password: undefined,
      passwordResetUUID: undefined,
    };

    return NextResponse.json(safeUser);
  } catch (error: any) {
    console.warn("Error getting user from request", error);
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }
}
