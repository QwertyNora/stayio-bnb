import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "@/utils/jwt";
import { getDateRange } from "@/utils/dates";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const listing = await prisma.listing.findFirst({
      where: { id: booking.listingId },
    });

    const dateRange = getDateRange(
      booking.checkInDate,
      booking.checkOutDate
    ).map((d) => d.getTime());

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const newBookedDates = listing.bookedDates.filter(
      (d) => !dateRange.includes(d.getTime())
    );

    const updatedListing = await prisma.listing.update({
      where: { id: listing.id },
      data: {
        bookedDates: newBookedDates,
      },
    });

    await prisma.booking.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
