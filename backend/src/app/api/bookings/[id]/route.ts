import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { checkInDate, checkOutDate, totalPrice } = body;

    const Authorization = request.headers.get("Authorization");
    if (!Authorization) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = Authorization.split(" ")[1];
    const decodedToken = await verifyJWT(token);

    if (!decodedToken) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = decodedToken.userId;

    // Fetch the current booking
    const currentBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { listing: true },
    });

    if (!currentBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if the user is authorized to update this booking
    if (currentBooking.createdById !== userId) {
      return NextResponse.json(
        {
          message: "Not authorized to update this booking",
          details: `User ID ${userId} does not match booking creator ID ${currentBooking.createdById}`,
        },
        { status: 403 }
      );
    }

    // Remove the old booking dates from the listing
    const oldBookedDates = currentBooking.listing.bookedDates.filter(
      (date) =>
        date >= currentBooking.checkInDate &&
        date <= currentBooking.checkOutDate
    );

    // Add the new booking dates to the listing
    const newBookedDates: Date[] = [];
    let currentDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    while (currentDate <= endDate) {
      newBookedDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Check if the new dates are available
    const conflictingDates = currentBooking.listing.bookedDates.filter(
      (date) =>
        !oldBookedDates.includes(date) &&
        newBookedDates.some((newDate) => newDate.getTime() === date.getTime())
    );

    if (conflictingDates.length > 0) {
      return NextResponse.json(
        { message: "Selected dates are not available" },
        { status: 400 }
      );
    }

    // Update the booking and the listing
    const [updatedBooking, updatedListing] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: params.id },
        data: {
          checkInDate: new Date(checkInDate),
          checkOutDate: new Date(checkOutDate),
          totalPrice,
        },
      }),
      prisma.listing.update({
        where: { id: currentBooking.listingId },
        data: {
          bookedDates: {
            set: [
              ...currentBooking.listing.bookedDates.filter(
                (date) => !oldBookedDates.includes(date)
              ),
              ...newBookedDates,
            ],
          },
        },
      }),
    ]);

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const Authorization = request.headers.get("Authorization");
    if (!Authorization) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = Authorization.split(" ")[1];
    const decodedToken = await verifyJWT(token);

    if (!decodedToken) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = decodedToken.userId;

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { listing: true },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.createdById !== userId) {
      return NextResponse.json(
        { message: "Not authorized to view this booking" },
        { status: 403 }
      );
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
