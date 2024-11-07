import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.listing.findFirst({
      where: { id: params.id, createdById: decoded.userId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.booking.deleteMany({
      where: { listingId: listing.id },
    });

    await prisma.listing.delete({
      where: { id: listing.id },
    });

    return NextResponse.json({
      message: "Listing and related bookings deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
