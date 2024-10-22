import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "@/utils/jwt"; // Importera JWT-verifieringsverktyget

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const Authorization = req.headers.get("Authorization");

    if (!Authorization) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = Authorization.split(" ")[1];
    const decodedToken = await verifyJWT(token);

    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Hämta användarens ID från det dekrypterade JWT-tokenet
    const userId = decodedToken.userId;

    // Hämta användarens information inklusive bokningar
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookings: {
          include: {
            listing: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const safeUser = {
      ...user,
      password: undefined,
      passwordResetUUID: undefined,
    };

    return NextResponse.json(safeUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
