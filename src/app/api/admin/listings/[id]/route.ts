import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request, options: APIOptions) {
  try {
    const listing = await prisma.listing.findFirst({
      where: { id: options.params.id },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { listingId: listing.id },
    });

    if (bookings.length === 0) {
      await prisma.listing.delete({
        where: { id: listing.id },
      });
      return NextResponse.json({ message: "Listing deleted successfully" });
    } else {
      await prisma.booking.deleteMany({
        where: { listingId: listing.id },
      });

      await prisma.listing.delete({
        where: { id: listing.id },
      });
    }

    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
