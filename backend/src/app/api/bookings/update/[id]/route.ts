import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import updateBooking from "@/actions/updateBooking";
import { verifyJWT } from "@/utils/jwt"; // JWT-verifiering

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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = Authorization.split(" ")[1];
    const user = await verifyJWT(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const updatedBooking = await updateBooking(params.id, {
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      totalPrice,
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error: any) {
    console.warn("Error updating booking:", error);
    return NextResponse.json(
      { message: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, options: APIOptions) {
  try {
    const bookingId = options.params.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
