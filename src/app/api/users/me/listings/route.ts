import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const listings = await prisma.listing.findMany({
      where: { createdById: decoded.userId },
      include: { amenities: { include: { amenity: true } } }, // Include amenities if needed
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
