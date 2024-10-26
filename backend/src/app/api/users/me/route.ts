import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("userId");
    const authHeader = request.headers.get("Authorization");

    if (!userId && !authHeader) {
      throw new Error("Failed to get userId or Authorization header");
    }

    let verifiedUserId: string;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decodedToken = await verifyJWT(token);
      if (!decodedToken) {
        throw new Error("Invalid token");
      }
      verifiedUserId = decodedToken.userId;
    } else if (userId) {
      verifiedUserId = userId;
    } else {
      throw new Error("Invalid authentication");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: verifiedUserId,
      },
      include: {
        bookings: true,
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
