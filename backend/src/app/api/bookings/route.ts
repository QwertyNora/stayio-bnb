import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bookingValidator from "@/utils/validators/bookingValidator";
import createBooking from "@/actions/createBooking";
import { verifyJWT } from "@/utils/jwt"; // Validera JWT-token

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", body); // Logga den inkommande datan

    // Validera användarens JWT
    const Authorization = request.headers.get("Authorization");
    if (!Authorization) {
      console.log("Authorization header missing");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = Authorization.split(" ")[1];
    const user = await verifyJWT(token);
    if (!user) {
      console.log("Invalid token");
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    console.log("User authenticated:", user);

    // Validera bokningsdata
    const [hasErrors, errors] = await bookingValidator(body);
    if (hasErrors) {
      console.log("Booking validation errors:", errors);
      return NextResponse.json({ errors }, { status: 400 });
    }
    console.log("Booking data validated");

    // Skapa bokningen
    const newBooking = await createBooking({
      ...body,
      createdById: user.userId, // Lägg till användar-ID från JWT
    });

    console.log("Booking created successfully:", newBooking);
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    console.warn("Error creating booking", error);
    return NextResponse.json(
      { message: "Failed to create booking" },
      { status: 500 }
    );
  }
}

//! Hmmm
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     const [hasErrors, errors] = await bookingValidator(body);
//     if (hasErrors) {
//       return NextResponse.json({ errors }, { status: 400 });
//     }

//     const newBooking = await prisma.booking.create({
//       data: {
//         ...body,
//         createdDate: new Date(),
//       },
//     });

//     return NextResponse.json(newBooking, { status: 201 });
//   } catch (error: any) {
//     console.warn("Error creating booking", error);
//     return NextResponse.json(
//       {
//         message: "A valid 'BookingData' object has to be sent",
//       },
//       { status: 400 }
//     );
//   }
// }

// pages/api/bookings.ts
