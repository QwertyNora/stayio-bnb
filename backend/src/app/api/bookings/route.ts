import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bookingValidator from "@/utils/validators/bookingValidator";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const bookings = await prisma.booking.findMany();
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const [hasErrors, errors] = await bookingValidator(body);
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        ...body,
        createdDate: new Date(),
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    console.warn("Error creating booking", error);
    return NextResponse.json(
      {
        message: "A valid 'BookingData' object has to be sent",
      },
      { status: 400 }
    );
  }
}
